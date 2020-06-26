const User = require('../models/User')
const UserImage = require('../models/UserImage')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const mailer = require('../modules/mailer')
const UserByToken = require('../middlewares/userByToken')

module.exports = {
    async index(req, res) {
        const users = await User.findAll({ include: { association: `avatar` } })
        return res.json(users)
    },

    async single(req, res) {
        const authHeader = req.headers.authorization

        if (!authHeader) return res.status(401).send({ error: 'No token provided' })

        const { user_id } = await UserByToken(authHeader)

        const userToken = await User.findByPk(user_id, {
            include: { association: 'avatar' },
        })

        if (!userToken) {
            return res.status(401).json({ message: 'User from token not found' })
        }

        return res.json(userToken)
    },

    async store(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            if (Object.keys(req.body).length === 0)
                return res.status(400).send({ error: `Por favor envie as infomações` })

            const { name, email, phone, cell, password, type, image_id } = req.body

            const { user_id } = await UserByToken(authHeader)

            const superUser = await User.findByPk(user_id)

            const userMail = await User.findOne({ where: { email } })

            if (userMail) return res.status(401).json({ message: 'the email you entered is already registered' })
            //sdad
            if (superUser.type != `super` && type == `super`)
                return res.status(401).json({ message: 'You are not allowed to register this type of user' })

            if (image_id) {
                const checkImage = await UserImage.findByPk(image_id)

                if (!checkImage) {
                    return res.status(401).json({ error: `This image_id not exist` })
                }
            }

            const user = await User.create({
                name,
                email,
                password,
                phone,
                cell,
                type,
            })

            if (image_id) {
                const avatar = await UserImage.findByPk(image_id)
                if (!avatar.user_id || avatar.user_id == user.id) await avatar.update({ user_id: user.id })
            }

            return res.json(user)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao criar novo usuário: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async forgot(req, res) {
        const { email } = req.body

        try {
            const user = await User.findOne({ where: { email } })

            if (!user) {
                return res.status(401).json({ message: 'the email you entered not exists' })
            }

            const token = crypto.randomBytes(20).toString('hex')

            const now = new Date()

            now.setHours(now.getHours() + 1)

            await user.update(
                {
                    passwordResetToken: token,
                    passwordResetExpires: now,
                },
                { where: { email } }
            )

            mailer.sendMail(
                {
                    to: email,
                    from: process.env.MAIL_FROM,
                    subject: 'Insta Checkout Reset Password!',
                    template: 'auth/forgot_password',
                    context: { token, client: user.name },
                },
                (err) => {
                    if (err) return res.status(400).send({ error: 'Cannot send forgot password email' })

                    return res.send()
                }
            )
        } catch (error) {
            console.log(error)
            return res.status(400).send({ error: 'Erro on forgot password, try again' })
        }
    },

    async reset(req, res) {
        const { email, password, token } = req.body

        try {
            const user = await User.findOne({ where: { email } })

            if (!user) return res.status(400).json({ Error: 'the email you entered not exists' })

            if (token !== user.passwordResetToken) return res.status(400).json({ Error: 'Token invalid' })

            const now = new Date()

            if (now > user.passwordResetExpires)
                return res.status(400).json({ Error: 'Token Expired, generate a new one' })

            user.password = password

            await user.update({ user })

            return res.json({ message: 'success!' })
        } catch (error) {
            res.status(400).send({ error: 'Erro on reset password, try again' })
        }
    },
}
