const UserByToken = require('../middlewares/userByToken')
const ProductItem = require('../models/ProductItem')
const Code = require('../models/Code')

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
}
