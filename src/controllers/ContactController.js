const UserByToken = require('../middlewares/userByToken')
const Contact = require('../models/Contact')

module.exports = {
    async index(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            const contact = await Contact.findAll()

            return res.json(contact)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao criar novo produto: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async show(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            const { contact_id } = req.params

            const contact = await Contact.findByPk(contact_id)

            if (!contact) return res.status(400).send({ error: `This contact not exist` })

            return res.json(contact)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao criar novo produto: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },
    async update(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            const { contact_id } = req.params

            const contact = await Contact.findByPk(contact_id)

            if (!contact) return res.status(400).send({ error: `This contact not exist` })

            await contact.update({ status: `attended` })

            const response = await Contact.findByPk(contact_id)

            return res.json(response)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao criar novo produto: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async destroy(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            const { contact_id } = req.params

            const contact = await Contact.findByPk(contact_id)

            if (!contact) return res.status(400).send({ error: `This contact not exist` })

            await contact.destroy()

            return res.json(contact)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao criar novo produto: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },
    async store(req, res, err) {
        try {
            const { fullname, email, subject, message } = req.body

            const contact = await Contact.create({ fullname, email, subject, message, status: `pending` })

            return res.json(contact)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao criar novo produto: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },
}
