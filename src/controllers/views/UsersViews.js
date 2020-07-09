const Users = require('../../models/User')
const User = require('../../models/User')
const Product = require('../../models/Product')
const Page = require('../../models/Page')
const authUser = require('../../middlewares/auth')

module.exports = {
    async view(req, res) {
        try {
            const token = req.cookies.token || ''

            if (!token) return res.redirect('/login')

            const { user_id } = await authUser(token)

            const user = await User.findByPk(user_id, { include: { association: `avatar` } })

            const productsCount = await Product.count()

            //userName
            const users = await Users.findAll()

            const pages = await Page.findAll()

            return res.render('users', {
                users: users.map((user) => user.toJSON()),
                userName: user.name,
                avatar: user.avatar ? user.avatar.url : `https://source.unsplash.com/lySzv_cqxH8/60x60`,
                productsCount,
                pageId: `page-top`,
                pageTitle: `Usuários`,
                token,
                pages: pages.map((page) => page.toJSON()),
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/login')
        }
    },
}
