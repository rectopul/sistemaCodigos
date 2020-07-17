const Category = require('../../models/Category')
const { Op } = require('sequelize')
const Page = require('../../models/Page')

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
                include: { association: `child`, include: { association: `child` } },
            })

            const home = await Page.findOne({ where: { slug: 'home' } })

            return res.render('contact', {
                pageTitle: `Contato`,
                categories,
                pageType: `site`,
                home: home.toJSON(),
            })
        } catch (error) {
            return res.redirect('/404')
        }
    },
}
