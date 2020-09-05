const Category = require('../../models/Category')
const { Op } = require('sequelize')
const Page = require('../../models/Page')
const Carousel = require('../../models/Carousel')
const Translation = require('../../models/Translation')
const Whatsapp = require('../../models/Whatsapp')
const partialTranslations = require('../../modules/translate')

module.exports = {
    async view(req, res) {
        try {
            const categories = await Category.findAll({
                where: {
                    parent: {
                        [Op.eq]: null,
                    },
                    slug: {
                        [Op.not]: `oculto`,
                    },
                },
                order: [['position', 'ASC']],
                include: {
                    association: `child`,
                    order: [['position', 'ASC']],
                    include: { association: `child`, order: [['position', 'ASC']] },
                },
            })

            const { lang: language } = req.query

            const home = await Page.findOne({
                where: { slug: 'home' },
                include: { association: `banner`, include: { association: `image` } },
            })

            console.log(language)

            if (language) {
                const translate = await Translation.findOne({
                    where: {
                        page_id: home.id,
                        language,
                    },
                })

                if (translate) home.content = translate.text
                if (translate) home.title = translate.title
            }

            const whatsapp = await Whatsapp.findAll()

            const carousel = await Carousel.findAll({ include: { association: `image` } })

            console.log(partialTranslations(language))

            return res.render('index', {
                pageTitle: `Bratva`,
                categories,
                banners: carousel.map((carr) => {
                    return carr.toJSON()
                }),
                bannerPape: home.toJSON().banner.image,
                home: home.toJSON(),
                partials: partialTranslations(language),
                language: language || ``,
                whatsapp: whatsapp[0].toJSON(),
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/dashboard')
        }
    },
}
