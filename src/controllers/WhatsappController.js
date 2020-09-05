const Whatsapp = require('../models/Whatsapp')
const UserByToken = require('../middlewares/userByToken')

module.exports = {
    async store(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            if (Object.keys(req.body).length === 0)
                return res.status(400).send({ error: `Por favor envie as infomações` })

            const { number } = req.body

            await UserByToken(authHeader)

            //check if already exist
            const whatsCheck = await Whatsapp.findAll()

            console.log(whatsCheck)

            if (whatsCheck.length > 0) {
                const _whatsapp = await Whatsapp.findByPk(whatsCheck[0].id)

                _whatsapp.update({ number })

                return res.json(_whatsapp)
            }

            const whatsapp = await Whatsapp.create({ number })

            return res.json(whatsapp)
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
