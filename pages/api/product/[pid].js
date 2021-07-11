import initDB from "../../../helpers/initDB";
import Product from '../../../models/Product'

initDB()

/* Product details of a particular product ID */
export default async (req, res) => {

    const { pid } = req.query

    const product = await Product.findOne({ _id: pid })

    res.status(200).json(product)

}