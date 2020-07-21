const UserByToken = require('../middlewares/userByToken')
const Partner = require('../models/Partner')
const Image = require('../models/Image')

module.exports = {
    async index(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            const partner = await Partner.findAll({ include: { association: `image` } })

            return res.json(partner)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao listar parceiros: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async show(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            const { partner_id } = req.params

            const partner = await Partner.findByPk(partner_id, { include: { association: `image` } })

            return res.json(partner)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao exibir parceiro: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async store(req, res, err) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            const { title, content, company, position } = req.body

            const format = content.replace(/\n/g, '<br>\n')

            let newPosition = (await Partner.count()) + 1

            const create = await Partner.create({
                title,
                content: format,
                company,
                position: parseInt(position) || parseInt(newPosition),
            })

            return res.json(create)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao criar novo parceiro: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },
    async update(req, res, err) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            const { partner_id } = req.params

            const { title, content, company, position } = req.body

            //check if exist
            const partner = await Partner.findByPk(partner_id)

            if (!partner) return res.status(400).send({ error: `this partner not exist` })

            console.log(parseInt(position))

            await partner.update({ title, content, company, position: parseInt(position) })

            return res.json(partner)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao atualizar banner: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async destroy(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            const { partner_id } = req.params

            const partner = await Partner.findByPk(partner_id)

            if (!partner) return res.status(400).send({ error: `This partner not exist` })

            const { image_id } = partner

            const image = await Image.findByPk(image_id)

            if (image) {
                await image.destroy()
            }

            await partner.destroy()

            return res.json(partner)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao criar novo parceiro: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },
}
