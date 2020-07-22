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

            const products = await Product.findAll({
                include: [
                    { association: `image`, where: { default: true }, limit: 1 },
                    {
                        association: `category`,
                        include: {
                            association: `category`,
                            where: {
                                slug: {
                                    [Op.not]: `oculto`,
                                },
                            },
                        },
                        required: true,
                    },
                ],
            })

            const productPage = await Page.findOne({ where: { slug: 'produtos' } })

            return res.render('page-products', {
                pageTitle: `Todos o produtos`,
                categories,
                listProducts: products ? products.map((product) => product.toJSON()) : null,
                pageType: 'site',
                pageClasses: `page-product`,
                pages: productPage ? productPage.map((page) => page.toJSON()) : null,
                content: productPage ? productPage.toJSON() : null,
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/login')
        }
    },
}
