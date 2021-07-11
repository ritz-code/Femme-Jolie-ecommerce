import initDB from '../../helpers/initDB'
import Product from '../../models/Product'

initDB()

export default async (req, res) => {
    switch (req.method) {
        case "GET":
            await getAllProducts(req, res)
            break
        case "POST":
            await saveProduct(req, res)
            break
    }
}

/* getting Product deets in the req and saving to Products DB */
const saveProduct = async (req, res) => {
    try {
        console.log("SAVE PRODUCT api/products")
        const { name, price, description, mediaUrl } = req.body
        if (!name || !price || !mediaUrl || !description) {
            return res.status(422).json({ error: "Please add all the fields" })
        }
        const newProduct = await new Product({
            name: name,
            price: price,
            mediaUrl: mediaUrl,
            description: description
        }).save()

        console.log("AFTER NEW PRODUCT SAVE() api/products")

        res.status(200).json(product)
    } catch (err) {
        res.status(500).json({ error: "Internal server error" })
        console.log(err)
    }
}

/* ALl products data */
const getAllProducts = async (req, res) => {
    try {
        Product.find()
            .then(products => {
                res.status(200).json(products)
            })
    } catch (err) {
        console.log(err)
    }
}