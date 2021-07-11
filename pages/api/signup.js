import initDB from "../../helpers/initDB"
import { ToastContainer, toast } from 'react-toastify';
import User from '../../models/User'
import Cart from '../../models/Cart'
import bcrypt from 'bcryptjs'

initDB()

export default async (req, res) => {
    const { name, email, password } = req.body

    try {
        /* Checking for input data in all fields */
        if (!name || !email || !password) {
            toast.error("Please add all the fields")
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        /* new user created with hashed password */
        const newUser = await new User({
            name: name,
            email: email,
            password: hashedPassword
        }).save()

        /* Creating an empty cart instance for the user on signup */
        new Cart({
            user: newUser._id
        }).save()

        res.status(201).json({ message: "Signup successful" })
    } catch (err) {
        console.log("err signup/api ", err)
    }
}