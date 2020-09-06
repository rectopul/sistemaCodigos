const Category = require('../../models/Category')
const Product = require('../../models/Product')
const Page = require('../../models/Page')
ProductCategory = require('../../models/ProductCategory')
const { Op } = require('sequelize')
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

            if (language) {
                products.map(async (product) => {
                    const translate = await Translation.findOne({
                        where: {
                            product_id: product.id,
                            language,
                        },
                    })

                    if (translate) product.description = translate.text
                    if (translate) product.name = translate.title
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

            const productPage = await Page.findOne({ where: { slug: 'produtos' } })

            const whatsapp = await Whatsapp.findAll()

            return res.render('page-products', {
                pageTitle: `Todos o produtos`,
                categories,
                listProducts: products ? products.map((product) => product.toJSON()) : null,
                pageType: 'site',
                pageClasses: `page-product`,
                content: productPage ? productPage.toJSON() : null,
                partials: partialTranslations(language),
                language,
                whatsapp: whatsapp[0].toJSON(),
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/login')
        }
    },
}
