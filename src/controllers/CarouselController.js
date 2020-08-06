const UserByToken = require('../middlewares/userByToken')
const Image = require('../models/Image')
const Carousel = require('../models/Carousel')

module.exports = {
    async show(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            const { carousel_id } = req.params

            const carousel = await Carousel.findByPk(carousel_id, { include: { association: `image` } })

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

            console.log(`Erro ao listar banner: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async store(req, res, err) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            const { name, image_id, url } = req.body

            //check page

            //check if image exist
            if (image_id) {
                const image = await Image.findByPk(image_id)

                if (!image) return res.status(400).send({ error: `This image not exist` })
            }

            //Create carousel
            const carousel = await Carousel.create({ name, image_id, url: url || null })

            const response = await Carousel.findByPk(carousel.id, { include: { association: `image` } })

            return res.json(response)
        } catch (error) {
            console.log(`Erro ao criar carousel novo: `, error)
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
    async update(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            const { carousel_id } = req.params

            const { name, url } = req.body

            const carousel = await Carousel.findByPk(carousel_id)

            if (!carousel) return res.status(400).send({ error: `This banner not exist` })

            await carousel.update({ name, url })

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

            console.log(`Erro atualizar carousel: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },
    async imageUpdate(req, res) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            const { carousel_id } = req.params

            const carousel = await Carousel.findByPk(carousel_id)

            const image = await Image.findByPk(carousel.image_id)

            if (!carousel) return res.status(400).send({ error: `This banner not exist` })

            if (image) await image.destroy()

            let { originalname: name, size, key, location: url = '' } = req.file

            const newImage = await Image.create({
                name,
                size,
                key,
                url,
            })

            const newCarousel = await Carousel.create({
                name: carousel.name,
                url: carousel.url,
                image_id: newImage.id,
            })

            const response = await Carousel.findByPk(newCarousel.id, { include: { association: `image` } })

            return res.json(response)
        } catch (error) {
            console.log(error)
            return res.status(400).send({ error: error.message })
        }
    },
}
