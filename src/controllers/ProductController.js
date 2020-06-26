const Product = require('../models/Product')
const UserByToken = require('../middlewares/userByToken')
const { index } = require('./UserController')
const ProductIten = require('../models/ProductItem')
const Code = require('../models/Code')

module.exports = {
    async show(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            const { user_id } = await UserByToken(authHeader)

            const { product_id } = req.params

            const products = await Product.findOne({ where: { id: product_id } })

            return res.json(products)
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
    async index(req, res) {
        /**
         * List all products in database
         */
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            const { user_id } = await UserByToken(authHeader)

            const products = await Product.findAll()

            return res.json(products)
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
    async store(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            const { user_id } = await UserByToken(authHeader)

            if (Object.keys(req.body).length === 0)
                return res.status(400).send({ error: `Por favor envie as infomações` })

            const { name, description, weight, brand, lot, type, availability, items } = req.body

            if (!items.length) return res.status(400).send({ error: `please enter at least one item` })

            const product = await Product.create({ name, description, weight, brand, lot, type, availability })

            const mapItems = await items.map(async (item) => {
                const iten = await ProductIten.create({ name: item.name, product_id: product.id }).then(
                    async (newItem) => {
                        const resitem = newItem.toJSON()
                        await Code.create({
                            code: item.code,
                            product_id: product.id,
                            item_id: resitem.id,
                        })
                    }
                )
            })

            await Promise.all(mapItems)

            const response = await Product.findByPk(product.id, {
                include: { association: `codes`, include: { association: `item` } },
            })

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
}
