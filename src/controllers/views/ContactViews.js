const Category = require('../../models/Category')
const { Op } = require('sequelize')
const Page = require('../../models/Page')
const Translation = require('../../models/Translation')
const partialTranslations = require('../../modules/translate')

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
            }

            return res.render('contact', {
                pageTitle: `Contato`,
                categories,
                pageType: `site`,
                page: contact.toJSON(),
                partials: partialTranslations(language),
                language,
            })
        } catch (error) {
            return res.redirect('/404')
        }
    },
}
