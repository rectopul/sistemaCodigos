const Product = require('../models/Product')
const UserByToken = require('../middlewares/userByToken')
const { index } = require('./UserController')
const ProductIten = require('../models/ProductItem')
const ProductCategory = require('../models/ProductCategory')
const Code = require('../models/Code')
const ImageProduct = require('../models/ImageProduct')
const { Op } = require('sequelize')

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

            const products = await Product.findAll({
                include: [{ association: `image` }, { association: `items`, include: { association: `code` } }],
            })

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

            console.log(`Erro ao Listar produtos: `, error)

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

            const {
                name,
                description,
                weight,
                brand,
                lot,
                type,
                excerpt,
                categories,
                availability,
                items,
                image_id,
            } = req.body

            if (!categories) return res.status(400).send({ error: `Please enter a category` })

            if (!items.length) return res.status(400).send({ error: `please enter at least one item` })

            //check if code exist
            const codes = items.map((item) => item.code)

            const checkItem = await Code.findAll({
                where: {
                    code: {
                        [Op.in]: codes,
                    },
                },
            })

            if (checkItem.length)
                return res
                    .status(400)
                    .json({ error: `One or more codes already exist`, codes: checkItem.map((code) => code.code) })

            const product = await Product.create({
                name,
                description,
                excerpt,
                weight,
                brand,
                lot,
                type,
                availability,
            })

            categories.map(async (category_id) => {
                await ProductCategory.create({ product_id: product.id, category_id })
            })

            //imagem do produto
            if (image_id) {
                const productImages = image_id.map(async (image) => {
                    await ImageProduct.update(
                        { product_id: product.id, default: image.default },
                        { where: { id: image.id } }
                    )
                })

                await Promise.all(productImages)
            }

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
                include: [{ association: `category` }, { association: `items`, include: { association: `code` } }],
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
    async destroy(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            const { user_id } = await UserByToken(authHeader)

            const { product_id } = req.params

            //check product
            const product = await Product.findByPk(product_id)

            await product.destroy()

            return res.json(product)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao deletar produto: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },
}
