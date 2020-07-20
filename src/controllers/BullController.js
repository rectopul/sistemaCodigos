const UserByToken = require('../middlewares/userByToken')
const Bull = require('../models/Bull')
const Product = require('../models/Product')

module.exports = {
    async store(req, res, err) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            let { originalname: name, size, key, location: url = '' } = req.file

            const bula = await Bull.create({ name, size, key, url })

            return res.json(bula)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao criar novo banner: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },
    async update(req, res, err) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            const { product_id } = req.params

            //check product
            const product = await Product.findByPk(product_id)

            if (!product) return res.status(400).send({ error: `This product not exist` })

            const pdf = await Bull.findOne({ where: { product_id } })

            if (!pdf) return res.status(400).send({ error: `This bull not exist` })

            await pdf.destroy()

            let { originalname: name, size, key, location: url = '' } = req.file

            const bula = await Bull.create({ name, size, key, url, product_id })

            return res.json(bula)
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
}
