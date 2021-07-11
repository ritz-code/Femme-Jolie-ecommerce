import initDB from "../../helpers/initDB"
import User from '../../models/User'
import bcrypt from 'bcryptjs'
import Authenticated from '../../helpers/Authenticated'

initDB()

export default async (req, res) => {
    switch (req.method) {
        case "GET":
            await fetchUsers(req, res)
            break
        case "PUT":
            await changeUserRole(req, res)
            break
    }
}

/* Fetches user data minus the password */
const fetchUsers = Authenticated(async (req, res) => {
    const users = await User.find({ _id: { $ne: req.userId } }).select("-password")
    res.status(200).json(users)
})

/* toggles between user and admin roles according to req data */
const changeUserRole = Authenticated(async (req, res) => {
    const { _id, role } = req.body
    const newRole = role == "user" ? "admin" : "user"
    const users = await User.findOneAndUpdate(
        { _id: _id },
        { role: newRole },
        { new: true }
    ).select("-password")
    res.status(200).json(users)
})
