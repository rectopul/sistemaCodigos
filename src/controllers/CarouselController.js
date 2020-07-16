const UserByToken = require('../middlewares/userByToken')
const Image = require('../models/Image')
const Carousel = require('../models/Carousel')

module.exports = {
    async store(req, res, err) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            const { name, image_id } = req.body

            //check page

            //check if image exist
            if (image_id) {
                const image = await Image.findByPk(image_id)

                if (!image) return res.status(400).send({ error: `This image not exist` })
            }

            //Create carousel
            const carousel = await Carousel.create({ name, image_id })

            const response = await Carousel.findByPk(carousel.id, { include: { association: `image` } })

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

            console.log(`Erro ao criar novo banner: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },
    async destroy(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            const { carousel_id } = req.params

            const carousel = await Carousel.findByPk(carousel_id)

            if (!carousel) return res.status(400).send({ error: `This banner not exist` })

            await carousel.destroy()

            return res.json(carousel)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro deletar carossel: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },
}
