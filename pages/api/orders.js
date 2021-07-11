import initDB from "../../helpers/initDB"
import Authenticated from '../../helpers/Authenticated'
import Order from '../../models/Order'

initDB()

/* Returns past orders of a user and populates the product */
export default Authenticated(async (req, res) => {
    const orders = await Order.find({ user: req.userId }).populate("products.product")
    res.status(200).json(orders)
})