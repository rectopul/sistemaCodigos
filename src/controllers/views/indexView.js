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
                },
                include: { association: `child`, include: { association: `child` } },
            })

            const home = await Page.findOne({
                where: { slug: 'home' },
                include: { association: `banner`, include: { association: `image` } },
            })

            console.log(home.toJSON().banner)

            return res.render('index', {
                pageTitle: `Bratva`,
                categories,
                bannerPape: home.toJSON().banner.image,
                home: home.toJSON(),
            })
        } catch (error) {
            return res.redirect('/dashboard')
        }
    },
}
