const Users = require('../../models/User')
const User = require('../../models/User')
const Product = require('../../models/Product')
const authUser = require('../../middlewares/auth')
const Category = require('../../models/Category')

module.exports = {
    async view(req, res) {
        try {
            const token = req.cookies.token || ''

            if (!token) return res.redirect('/login')

            const { user_id } = await authUser(token)

            const user = await User.findByPk(user_id, { include: { association: `avatar` } })

            const productsCount = await Product.count()

            //get categories
            const categories = await Category.findAll({ include: { association: `products` } })

            //userName
            const users = await Users.findAll()

            return res.render('categories', {
                users: users.map((user) => user.toJSON()),
                userName: user.name,
                avatar: user.avatar ? user.avatar.url : `https://source.unsplash.com/lySzv_cqxH8/60x60`,
                productsCount,
                pageId: `page-top`,
                pageTitle: `Usuários`,
                categories: categories.map((category) => {
                    const categoria = category.toJSON()
                    const { products, createdAt } = categoria

                    categoria.products = products.length

                    const data = new Intl.DateTimeFormat('pt-BR').format(createdAt)

                    categoria.createdAt = data

                    return categoria
                }),
                token,
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/login')
        }
    },
}
