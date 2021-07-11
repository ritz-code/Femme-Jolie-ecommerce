import jwt from 'jsonwebtoken'


/* Higher order function to aunthenticate the token received and retreive the user ID from the token */
function Authenticated(icomponent) {
    return (req, res) => {
        const { authorization } = req.headers
        if (!authorization) {
            return res.status(401).json({ error: "You must log in" })
        }
        try {
            const { userId } = jwt.verify(authorization, process.env.JWT_SECRET)
            req.userId = userId
            return icomponent(req, res)
        } catch (err) {
            return res.status(401).json({ error: "You must log in" })
        }
    }
}

export default Authenticated