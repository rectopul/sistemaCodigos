const User = require('../../models/User')
const authUser = require('../../middlewares/auth')
const Category = require('../../models/Category')
const Product = require('../../models/Product')
const Page = require('../../models/Page')
ProductCategory = require('../../models/ProductCategory')
const { Op } = require('sequelize')

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

            const { category_slug } = req.params

            const products = await Category.findOne({
                where: { slug: category_slug },
                include: {
                    association: `products`,
                    include: { association: `product`, include: { association: `image`, where: { default: true } } },
                },
            })

            const pages = await Page.findAll()

            const productPage = await Page.findOne({ where: { slug: 'produtos' } })

            return res.render('page-products', {
                pageTitle: `Bratva`,
                categories,
                listProducts: products.toJSON(),
                pageType: 'site',
                pageClasses: `page-product`,
                pages: pages.map((page) => page.toJSON()),
                content: productPage.toJSON(),
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/login')
        }
    },
}
