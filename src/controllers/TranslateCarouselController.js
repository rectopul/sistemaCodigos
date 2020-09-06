const TranslateCarousel = require('../models/TranslateCarousel')
const UserByToken = require('../middlewares/userByToken')

module.exports = {
    async store(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            if (Object.keys(req.body).length === 0)
                return res.status(400).send({ error: `Por favor envie as informações` })

            const { carousel_id, image_id, language } = req.body

            if (!image_id) return res.status(400).send({ error: `Por favor informe a imagem` })
            if (!language) return res.status(400).send({ error: `Por favor informe a linguagem` })

            await UserByToken(authHeader)

            //check if already exist
            const carousel = await TranslateCarousel.findOne({ where: { carousel_id, language } })

            if (carousel) {
                carousel.update({ image_id })

                return res.json(carousel)
            }

            const translate = await TranslateCarousel.create({ carousel_id, image_id, language })

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
