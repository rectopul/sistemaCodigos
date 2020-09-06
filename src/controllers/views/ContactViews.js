const Category = require('../../models/Category')
const { Op } = require('sequelize')
const Page = require('../../models/Page')
const Translation = require('../../models/Translation')
const partialTranslations = require('../../modules/translate')
const Whatsapp = require('../../models/Whatsapp')

module.exports = {
    async view(req, res) {
        try {
            const { lang: language } = req.query

            const categories = await Category.findAll({
                where: {
                    parent: {
                        [Op.eq]: null,
                    },
                    slug: {
                        [Op.not]: `oculto`,
                    },
                },
                include: { association: `child`, include: { association: `child` } },
            })

            const contact = await Page.findOne({ where: { slug: 'contato' } })

            if (language) {
                const translate = await Translation.findOne({
                    where: {
                        page_id: contact.id,
                        language,
                    },
                })

                if (translate) contact.content = translate.text
                if (translate) contact.title = translate.title

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

            const whatsapp = await Whatsapp.findAll()

            return res.render('contact', {
                pageTitle: `Contato`,
                categories,
                pageType: `site`,
                page: contact.toJSON(),
                partials: partialTranslations(language),
                language: language || ``,
                whatsapp: whatsapp[0].toJSON(),
            })
        } catch (error) {
            return res.redirect('/404')
        }
    },
}
