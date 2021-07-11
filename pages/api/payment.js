import Stripe from 'stripe'
import { v4 as uuidV4 } from 'uuid'
import Cart from '../../models/Cart'
import jwt from 'jsonwebtoken'
import Order from '../../models/Order'
import initDB from "../../helpers/initDB"

initDB()

export default async (req, res) => {

    /* Stripe to checkout using credit card deets */
    const stripe = Stripe(process.env.STRIPE_SECRET)
    const { authorization } = req.headers
    const { paymentInfo } = req.body

    if (!authorization) {
        return res.status(401).json({ error: "You must log in" })
    }

    try {
        const { userId } = jwt.verify(authorization, process.env.JWT_SECRET)
        const cart = await Cart.findOne({ user: userId }).populate("products.product")

        /* Checking the total of cart at server-side too */
        let totalPrice = 0
        cart.products.forEach(item => {
            totalPrice += item.quantity * item.product.price
        })

        /* checking for existing customers */
        const prevCustomer = await stripe.customers.list({
            email: paymentInfo.email
        })

        const isExistingCustomer = prevCustomer.data.length > 0

        /* saving new customer data */
        let newCustomer
        if (!isExistingCustomer) {
            newCustomer = await stripe.customers.create({
                email: paymentInfo.email,
                source: paymentInfo.id
            })
        }

        /* User charge deets  created in Stripe */
        const charge = await stripe.charges.create(
            {
                currency: "USD",
                amount: totalPrice * 100,
                receipt_email: paymentInfo.email,
                customer: isExistingCustomer ? prevCustomer.data[0].id : newCustomer.id,
                description: `You purchased a product | ${paymentInfo.email}`
            }, {
            idempotencyKey: uuidV4()
        }
        )

        await new Order({
            user: userId,
            email: paymentInfo.email,
            total: totalPrice,
            products: cart.products
        }).save()

        await Cart.findOneAndUpdate(
            { _id: cart._id },
            { $set: { products: [] } }
        )

        res.status(200).json({ message: "Payment was received" })
    } catch (err) {
        console.log("api/payment err ", err)
    }
}
