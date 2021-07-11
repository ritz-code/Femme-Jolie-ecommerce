import initDB from "../../helpers/initDB"
import User from '../../models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

initDB()

export default async (req, res) => {
    /* email & password retreived from req */
    const { email, password } = req.body

    try {
        if (!email || !password) {
            return res.status(422).json({ error: "Please enter all the fields" })
        }
        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(422).json({ error: "Invalid username/password" })
        }

        const isUser = bcrypt.compare(password, user.password)

        /* Generating a token after user is authenticated. 
            Token and user detail is sent to the client side */
        if (isUser) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
                expiresIn: '7d'
            })

            const { name, role, email } = user
            res.status(201).json({ token: token, user: { name: name, role: role, email: email } })
        } else {
            return res.status(422).json({ error: "username/password don't match" })
        }
    } catch (err) {
        console.log(err)
    }
}