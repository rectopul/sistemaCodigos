const Category = require('../models/Category')
const userByToken = require('../middlewares/userByToken')
const { show } = require('./ProductController')

module.exports = {
    async index(req, res) {
        try {
            const authHeader = req.headers.authorization

            const { user_id } = await userByToken(authHeader)

            const response = await Category.findAll({ include: { association: `sub` } })

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

            console.log(`Erro ao cadastrar categoria: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },
    async show(req, res) {
        try {
            const authHeader = req.headers.authorization

            const { user_id } = await userByToken(authHeader)

            const { categori_id } = req.params

            const response = await Category.findByPk(categori_id, { include: { association: `sub` } })

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

            console.log(`Erro ao cadastrar categoria: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },
    async store(req, res) {
        try {
            const authHeader = req.headers.authorization

            const { user_id } = await userByToken(authHeader)

            const { name, description, parent } = req.body

            let { slug } = req.body

            if (!slug) {
                slug = name
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .toLowerCase()
                    .replace(' ', '_')
            }

            const category = await Category.create({ name, slug, description, parent })

            const response = await Category.findByPk(category.id, { include: { association: `sub` } })

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

            console.log(`Erro ao cadastrar categoria: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async destroy(req, res) {
        try {
            const authHeader = req.headers.authorization

            const { user_id } = await userByToken(authHeader)

            const { category_id } = req.params

            //check if category exist
            const category = await Category.findByPk(category_id)

            if (!category) return res.status(400).send({ error: `Category not exist` })

            await category.destroy()

            return res.json(category)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao excluir categoria: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },
    async edit(req, res) {
        try {
            const authHeader = req.headers.authorization

            const { user_id } = await userByToken(authHeader)

            const { category_id } = req.params

            const { name, description, parent } = req.body

            let { slug } = req.body

            if (!slug) {
                slug = name
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .toLowerCase()
                    .replace(' ', '_')
            }

            await Category.update({ name, slug, description, parent }, { where: { id: category_id } })

            const response = await Category.findByPk(category_id, { include: { association: `sub` } })

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

            console.log(`Erro ao excluir categoria: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },
}
