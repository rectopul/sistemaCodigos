const Category = require('../../models/Category')
const Product = require('../../models/Product')
const Page = require('../../models/Page')
ProductCategory = require('../../models/ProductCategory')
const { Op } = require('sequelize')

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
                },
                include: { association: `child`, include: { association: `child` } },
            })

            const pages = await Page.findAll()

            const { product_id } = req.params

            if (!product_id) return res.redirect('/404')

            const category = await Product.findByPk(product_id, { include: { association: `category` } })

            const idsCategory = category.category.map((inf) => inf.category_id)

            const productInfos = await Product.findByPk(product_id, { include: { association: `image` } })

            const products = await Category.findAll({
                where: {
                    id: {
                        [Op.in]: idsCategory,
                    },
                },
                include: {
                    association: `products`,
                    include: { association: `product`, include: { association: `image`, where: { default: true } } },
                },
            })

            const productSend = products.map((prod) => {
                const produto = prod.toJSON()

                const productInfo = produto.products.map((product) => {
                    if (product.product.image[0]) {
                        const imageDefault = product.product.image[0]

                        product.product.imageDefault = imageDefault

                        return product.product
                    } else {
                        product.product.imageDefault = {
                            url: `https://via.placeholder.com/500`,
                            name: `Image default`,
                        }

                        return product.product
                    }
                })

                productInfo

                return productInfo
            })

            const productPage = await Page.findOne({ where: { slug: 'produtos' } })

            return res.render('product', {
                pageTitle: `Produto`,
                categories,
                pageType: 'site',
                product: productInfos.toJSON(),
                listProducts: productSend[0],
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
