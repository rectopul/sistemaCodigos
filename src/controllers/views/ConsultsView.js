const User = require('../../models/User')
const authUser = require('../../middlewares/auth')
const Page = require('../../models/Page')
const Search = require('../../models/Search')

module.exports = {
    async view(req, res) {
        try {
            const token = req.cookies.token || ''

            if (!token) return res.redirect('/login')

            const { user_id } = await authUser(token)

            const user = await User.findByPk(user_id, { include: { association: `avatar` } })

            //userName
            const searches = await Search.findAll({ include: { association: `code` } })

            const pages = await Page.findAll()

            return res.render('consults', {
                userName: user.name,
                avatar: user.avatar ? user.avatar.url : `https://source.unsplash.com/lySzv_cqxH8/60x60`,
                pageId: `page-top`,
                pageTitle: `Consultas`,
                pages: pages.map((page) => page.toJSON()),
                searches: searches.map((search) => {
                    const srch = search.toJSON()
                    srch.date = new Intl.DateTimeFormat('pt-BR').format(srch.ceatedAt)
                    return srch
                }),
                token,
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/login')
        }
    },
}
