import initDB from "../../helpers/initDB"
import Cart from '../../models/Cart'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import Authenticated from '../../helpers/Authenticated'

initDB()

export default async (req, res) => {
    switch (req.method) {
        case "GET":
            await fetchUserCart(req, res)
            break
        case "PUT":
            await addProduct(req, res)
            break
        case "DELETE":
            await removeProduct(req, res)
            break
    }
}

/* Remove a product from the cart */
const removeProduct = Authenticated(async (req, res) => {
    const { productId } = req.body
    const cart = await Cart.findOneAndUpdate(
        { user: req.userId },
        { $pull: { products: { product: productId } } },
        { new: true }
    ).populate("products.product")

    res.status(200).json(cart.products)
})

/* Details of User Cart */
const fetchUserCart = Authenticated(async (req, res) => {
    const cart = await Cart.findOne({ user: req.userId }).populate('products.product')
    res.status(200).json(cart.products)
})

/* Add a product to the cart if item doesn't exist, if exists change only the quantity */
const addProduct = Authenticated(async (req, res) => {
    const { quantity, productId } = req.body
    const cart = await Cart.findOne({ user: req.userId })
    const itemExists = cart.products.some(item => item.product == productId)

    if (itemExists) {
        await Cart.updateOne(
            { _id: cart._id, "products.product": productId },
            { $inc: { "products.$.quantity": quantity } }
        )

    } else {
        await Cart.updateOne(
            { _id: cart._id },
            { $push: { products: { quantity: quantity, product: productId } } }
        )
    }
    res.status(200).json({ message: "Product added to cart" })
})
