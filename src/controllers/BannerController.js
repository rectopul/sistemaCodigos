const UserByToken = require('../middlewares/userByToken')
const Banner = require('../models/Banner')
const Page = require('../models/Page')
const BannerImage = require('../models/BannerImage')

module.exports = {
    async store(req, res, err) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            const { page_id } = req.params

            const { title, position, description, image_id } = req.body

            //check page

            const page = await Page.findByPk(page_id)

            if (!page) return res.status(400).send({ error: `This page not exist` })

            if (!title && !position) return res.status(400).send({ error: `please enter the title and position` })

            //check if image exist
            if (image_id) {
                const bannerImage = await BannerImage.findByPk(image_id)

                if (!bannerImage) return res.status(400).send({ error: `This image not exist` })
            }

            //Create banner
            const banner = await Banner.create({ title, position, description, page_id: page.id })

            if (image_id) {
                await BannerImage.update({ banner_id: banner.id }, { where: { id: image_id } })
            }

            const response = await Banner.findByPk(banner.id, { include: { association: `image` } })

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
    async update(req, res, err) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            const { title, position, description } = req.body

            const { banner_id } = req.params

            const banner = await Banner.findByPk(banner_id)

            if (!banner) return res.status(400).send({ error: `This banner not exist` })

            await banner.update({ title, position, description })

            return res.json(banner)
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
