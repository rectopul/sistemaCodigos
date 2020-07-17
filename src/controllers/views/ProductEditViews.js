const User = require('../../models/User')
const Product = require('../../models/Product')
const Contact = require('../../models/Contact')
const Page = require('../../models/Page')
const Category = require('../../models/Category')
const authUser = require('../../middlewares/auth')

module.exports = {
    async view(req, res) {
        try {
            const { token } = req.cookies

            if (!token) return res.redirect('/login')

            const { user_id } = await authUser(token)

            const { product_id } = req.params

            if (!product_id) return res.redirect('/dashboard')

            const product = await Product.findByPk(product_id, {
                include: [
                    { association: `image` },
                    { association: `codes` },
                    { association: `category` },
                    { association: `items`, include: { association: `code` } },
                ],
            })

            console.log(product.toJSON().items)

            const user = await User.findByPk(user_id, { include: { association: `avatar` } })

            //categorias
            const listCategories = await Category.findAll()

            const productCategories = product.toJSON().category.map((cat) => cat.category_id)

            //get category selected
            const categories = listCategories.map((category) => {
                const cat = category.toJSON()
                if (productCategories.indexOf(cat.id) != -1) cat.selected = true
                else cat.selected = false

                return cat
            })

            //products
            const pages = await Page.findAll()

            const contacts = await Contact.findAll()

            return res.render('productEdit', {
                userName: user.name,
                avatar: user.avatar ? user.avatar.url : `https://source.unsplash.com/lySzv_cqxH8/60x60`,
                pageId: `page-top`,
                pageTitle: `Lista de Produtos`,
                token,
                categories,
                codeLength: product.toJSON().items.length,
                product: product.toJSON(),
                messagesCount: contacts.length,
                messages: contacts.map((cliente) => {
                    const client = cliente.toJSON()
                    const { createdAt, fullname } = client

                    const [name, surname] = fullname.split(' ')

                    const data = new Intl.DateTimeFormat('pt-BR').format(createdAt)

                    client.date = data
                    client.name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()

                    return client
                }),
                pages: pages.map((page) => page.toJSON()),
            })
        } catch (error) {
            console.log(error)
            return res.json(error)
            //return res.redirect('/login')
        }
    },
}
