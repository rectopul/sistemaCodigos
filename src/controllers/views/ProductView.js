const Category = require('../../models/Category')
const Product = require('../../models/Product')
const Page = require('../../models/Page')
const ProductCategory = require('../../models/ProductCategory')
const ImageProduct = require('../../models/ImageProduct')
const { Op } = require('sequelize')
const sequelize = require('sequelize')

function doTruncarStr(str, size) {
    if (str == undefined || str == 'undefined' || str == '' || size == undefined || size == 'undefined' || size == '') {
        return str
    }

    var shortText = str
    if (str.length >= size + 3) {
        shortText = str.substring(0, size).concat('...')
    }
    return shortText
}

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

            const pages = await Page.findAll()

            const { product_id: product_slug } = req.params

            if (!product_slug) return res.redirect('/404')

            const category = await Product.findOne({
                where: { slug: product_slug },
                include: { association: `category` },
            })

            //get all products in category oculto
            const hiddenProducts = await Category.findOne({
                where: { slug: `oculto` },
                include: { association: `products` },
            })

            const hidenIds = hiddenProducts.products.map((id) => id.product_id)

            const idsCategory = category.category.map((inf) => inf.category_id)

            const productInfos = await Product.findOne({
                where: { slug: product_slug },
                include: [{ association: `image` }, { association: `bula` }],
            })

            const products = await Product.findAll({
                where: { slug: { [Op.not]: product_slug }, id: { [Op.notIn]: hidenIds } },
                order: [[sequelize.literal('random()')]],
                include: { association: `image`, where: { default: true }, required: false },
                limit: 4,
            })

            const imageDef = await ImageProduct.findOne({ where: { product_id: category.id, default: true } })

            const productSend = products.map((product) => {
                const produto = product.toJSON()
                if (produto) {
                    if (produto.image.length) {
                        produto.image = [produto.image[0]]
                    }

                    return produto
                }
            })

            const productPage = await Page.findOne({ where: { slug: 'produtos' } })

            return res.render('product', {
                pageTitle: productInfos ? productInfos.toJSON().name : `Produto`,
                meta: { description: productInfos.toJSON().excerpt },
                categories,
                pageMetaTag: `true`,
                pageType: 'site',
                imageDef: imageDef ? imageDef.toJSON() : null,
                product: productInfos ? productInfos.toJSON() : null,
                listProducts: productSend ? productSend : [],
                pageClasses: `page-product`,
                pages: pages ? pages.map((page) => page.toJSON()) : [],
                content: productPage ? productPage.toJSON() : null,
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/login')
        }
    },
}
