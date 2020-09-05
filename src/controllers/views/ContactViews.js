const Category = require('../../models/Category')
const { Op } = require('sequelize')
const Page = require('../../models/Page')
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

            const home = await Page.findOne({ where: { slug: 'home' } })

            return res.render('contact', {
                pageTitle: `Contato`,
                categories,
                pageType: `site`,
                home: home.toJSON(),
                partials: partialTranslations(language),
                language,
            })
        } catch (error) {
            return res.redirect('/404')
        }
    },
}
