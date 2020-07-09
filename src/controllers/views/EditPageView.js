const User = require('../../models/User')
const authUser = require('../../middlewares/auth')
const Page = require('../../models/Page')

module.exports = {
    async view(req, res) {
        try {
            const token = req.cookies.token || ''

            if (!token) return res.redirect('/login')

            const { user_id } = await authUser(token)

            const { page_slug } = req.params

            if (!page_slug) return res.redirect('/dashboard')

            const user = await User.findByPk(user_id, { include: { association: `avatar` } })

            const pageInfo = await Page.findOne({
                where: { slug: page_slug },
                include: { association: `banner`, include: { association: `image` } },
            })

            const pages = await Page.findAll()

            return res.render('editPages', {
                user: user.toJSON(),
                userName: user.name,
                avatar: user.avatar ? user.avatar.url : `https://source.unsplash.com/lySzv_cqxH8/60x60`,
                pageId: `page-top`,
                pageTitle: `Editar página`,
                token,
                info: pageInfo.toJSON(),
                pages: pages.map((page) => page.toJSON()),
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/login')
        }
    },
}
