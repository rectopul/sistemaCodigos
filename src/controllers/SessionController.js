const User = require('../models/User')

class SessionController {
    async store(req, res) {
        try {
            const { email, password } = req.body

            const expiration = process.env.EXPIRATION_TOKEN === 'testing' ? 60 : 1440

            //super and administrator
            const user = await User.findOne({ where: { email } })

            if (!user) {
                return res.status(401).json({ error: 'User not found' })
            }

            if (!(await user.checkPassword(password))) {
                return res.status(401).json({ error: 'Incorrect Password' })
            }

            const userjson = user.toJSON()

            delete userjson.password_hash
            delete userjson.passwordResetToken
            delete userjson.passwordResetExpires

            res.cookie('token', user.generateToken(), {
                maxAge: expiration * 60000,
                expires: new Date(Date.now() + expiration * 60000),
                httpOnly: true,
                //secure: false, // set to true if your using https
            })

            return res.json({
                userjson,
                token: user.generateToken(),
            })
        } catch (error) {
            return res.status(500).json({ error: error.message })
            console.log(`Erro de sessão: `, error)
        }
    }
}

module.exports = new SessionController()
