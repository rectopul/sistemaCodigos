const Translation = require('../models/Translation')
const UserByToken = require('../middlewares/userByToken')
const { Op } = require('sequelize')

module.exports = {
    async store(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            if (Object.keys(req.body).length === 0)
                return res.status(400).send({ error: `Por favor envie as infomações` })

            const { language, contentTranslate: text, page_id, product_id, category_id, type, title } = req.body

            if (!text) return res.status(400).send({ error: `Por favor envie a tradução` })

            const { user_id } = await UserByToken(authHeader)

            const orConditions = []

            if (type === `pages`) orConditions.push({ page_id: parseInt(page_id), language })
            if (type === `products`) orConditions.push({ product_id: parseInt(product_id), language })
            if (type === `categories`) orConditions.push({ category_id: parseInt(category_id), language })

            //check if already exist
            const translateCheck = await Translation.findOne({
                where: {
                    [Op.or]: orConditions,
                },
            })

            if (translateCheck) {
                translateCheck.update({ text, title })

                return res.json(translateCheck)
            }

            const translate = await Translation.create({
                language,
                title,
                text,
                page_id: parseInt(page_id) || null,
                product_id: parseInt(product_id) || null,
                category_id: parseInt(category_id) || null,
            })

            return res.json(translate)
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
}
