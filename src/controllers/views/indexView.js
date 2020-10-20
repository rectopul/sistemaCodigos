const Category = require('../../models/Category')
const { Op } = require('sequelize')
const Page = require('../../models/Page')
const Carousel = require('../../models/Carousel')
const Translation = require('../../models/Translation')
const TranslateCarousel = require('../../models/TranslateCarousel')
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


            const whatsapp = await Whatsapp.findAll()

            if(!home || !whatsapp) return res.redirect('/dashboard')

            const carousel = await Carousel.findAll({ include: { association: `image` } })

            let translateCarousel = carousel.map((carousel) => carousel.toJSON())

            if (language) {
                const translate = await Translation.findOne({
                    where: {
                        page_id: home.id,
                        language,
                    },
                })

                if (translate) home.content = translate.text
                if (translate) home.title = translate.title

                //translate banner
                translateCarousel = await carousel.map(async (crsl) => {
                    try {
                        const image = crsl.toJSON()
                        const translate = await TranslateCarousel.findOne({
                            where: {
                                carousel_id: image.id,
                                language,
                            },
                            include: { association: `image` },
                        })

                        if (translate) image.image = translate.toJSON().image

                        return image
                    } catch (error) {
                        console.log(error)
                    }
                })

                //translate category
                categories.map(async (category) => {
                    const _translate = await Translation.findOne({
                        where: {
                            category_id: category.id,
                            language,
                        },
                    })

                    if (_translate) {
                        category.description = _translate.text
                        category.name = _translate.title
                    }

                    //translate child
                    category.child.map(async (child) => {
                        const __translate = await Translation.findOne({
                            where: {
                                category_id: child.id,
                                language,
                            },
                        })

                        if (__translate) {
                            child.description = __translate.text
                            child.name = __translate.title
                        }
                    })
                })
            }

            translateCarousel = await Promise.all(translateCarousel)

            return res.render('index', {
                pageTitle: `Bratva`,
                categories,
                banners: translateCarousel,
                bannerPape: home.toJSON().banner.image,
                home: home.toJSON(),
                partials: partialTranslations(language),
                language: language || ``,
                whatsapp: whatsapp[0] ? whatsapp[0].toJSON() : '',
            })
        } catch (error) {
            return res.redirect('/dashboard')
        }
    },
}
