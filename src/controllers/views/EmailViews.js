const User = require('../../models/User')
const authUser = require('../../middlewares/auth')
const Page = require('../../models/Page')
const Subscriber = require('../../models/Subscriber')

module.exports = {
    async view(req, res) {
        try {
            const token = req.cookies.token || ''

            if (!token) return res.redirect('/login')

            const { user_id } = await authUser(token)

            const user = await User.findByPk(user_id, { include: { association: `avatar` } })

            //userName
            const subscribers = await Subscriber.findAll()

            const pages = await Page.findAll()

            return res.render('emails', {
                userName: user.name,
                avatar: user.avatar ? user.avatar.url : `https://source.unsplash.com/lySzv_cqxH8/60x60`,
                pageId: `page-top`,
                pageTitle: `Lida de E-mails`,
                pages: pages.map((page) => page.toJSON()),
                subscribers: subscribers.map((subscribr) => {
                    const sbrsc = subscribr.toJSON()
                    sbrsc.date = new Intl.DateTimeFormat('pt-BR').format(sbrsc.ceatedAt)
                    console.log(sbrsc)
                    return sbrsc
                }),
                token,
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/login')
        }
    },
}
