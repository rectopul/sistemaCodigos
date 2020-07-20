const UserByToken = require('../middlewares/userByToken')
const ProductItem = require('../models/ProductItem')
const Code = require('../models/Code')
const Product = require('../models/Product')

module.exports = {
    async destroy(req, res, err) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            const { code_id } = req.params

            await UserByToken(authHeader)

            const code = await Code.findByPk(code_id, { include: { association: `item` } })

            if (!code) return res.status(400).send({ error: `This code not exist` })

            //check item
            const item = await ProductItem.findByPk(code.item.id)

            await code.destroy()
            await item.destroy()

            return res.json(code)
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
    async store(req, res) {
        try {
            const authHeader = req.headers.authorization

            const { product_id } = req.params

            await UserByToken(authHeader)

            const product = await Product.findByPk(product_id)

            if (!product) return res.status(400).send({ error: `This product not exist` })

            const { name, code } = req.body
            //check if code exist
            const codeexist = await Code.findOne({ where: { code } })

            if (codeexist) return res.status(400).send({ error: `This code already exist` })

            const item = await ProductItem.create({
                name,
                product_id,
            })

            await Code.create({
                product_id,
                item_id: item.id,
                code,
            })

            const response = await ProductItem.findByPk(item.id, { include: { association: `code` } })

            return res.json(response)
        } catch (error) {
            console.log(error)
        }
    },
}
