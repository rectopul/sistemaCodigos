const User = require('../../models/User')
const authUser = require('../../middlewares/auth')
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

            const { category_slug } = req.params

            const products = await Category.findOne({
                where: { slug: category_slug },
                include: {
                    association: `products`,
                    include: {
                        association: `product`,
                        include: { association: `image`, where: { default: true }, limit: 1, required: false },
                    },
                },
            })

            if (language) {
                products.products.map(async (product) => {
                    const translate = await Translation.findOne({
                        where: {
                            product_id: product.product.id,
                            language,
                        },
                    })

                    if (translate) product.product.description = translate.text
                    if (translate) product.product.name = translate.title

                    console.log(`traducao`, translate)
                    console.log(`produto`, product.product)

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
                })
            }

            const pages = await Page.findAll()

            const productPage = await Page.findOne({ where: { slug: 'produtos' } })

            const whatsapp = await Whatsapp.findAll()

            return res.render('page-products', {
                pageTitle: `Produtos`,
                categories,
                listProducts: products.toJSON().products.map((product) => product.product),
                pageType: 'site',
                pageClasses: `page-product`,
                pages: pages.map((page) => page.toJSON()),
                content: productPage ? productPage.toJSON() : null,
                partials: partialTranslations(language),
                language,
                whatsapp: whatsapp[0] ? whatsapp[0].toJSON() : '',
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/login')
        }
    },
}
