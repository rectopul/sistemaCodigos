const UserByToken = require('../middlewares/userByToken')
const Banner = require('../models/Banner')
const Page = require('../models/Page')
const BannerImage = require('../models/BannerImage')

module.exports = {
    async store(req, res, err) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            const { user_id } = await UserByToken(authHeader)

            const { title, content, banner } = req.body

            if (!title && !content) return res.status(400).send({ error: `please enter the title and content` })

            let { slug } = req.body

            if (!slug) {
                slug = name
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .toLowerCase()
                    .replace(' ', '_')
            }

            const page = await Page.create({ title, content, slug })

            if (banner) {
                const { title: banner_title, position: banner_position, description: banner_description } = banner

                const banner = await Banner.create({
                    title: banner_title,
                    position: banner_position,
                    description: banner_description,
                    page_id: page.id,
                })

                const response = await Page.findByPk(page.id, { include: { association: `banner` } })

                return res.json(response)
            }

            return res.json(page)
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
    async update(req, res, err) {
        try {
            //Get user id by token
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            const { content, banner } = req.body

            const { page_id } = req.params

            let { slug } = req.body

            if (!slug) {
                slug = name
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .toLowerCase()
                    .replace(' ', '_')
            }

            const page = await Page.findByPk(page_id)

            if (!page) return res.status(400).send({ error: `This page not exist` })

            if (banner) {
                const {
                    title: banner_title,
                    position: banner_position,
                    description: banner_description,
                    image_id,
                } = banner

                //delete all banners from this page
                await Banner.destroy({ where: { page_id: page.id } })

                const newBanner = await Banner.create({
                    title: banner_title,
                    position: banner_position,
                    description: banner_description,
                    page_id: page.id,
                })

                //delete all images form this banner
                await BannerImage.destroy({ where: { banner_id: newBanner.id } })

                //get image
                const imageBanner = await BannerImage.findByPk(image_id)

                //update image
                await imageBanner.update({ banner_id: newBanner.id })
            }

            await page.update({ content, slug })

            const response = await Page.findByPk(page.id, {
                include: { association: `banner`, include: { association: `image` } },
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
