const User = require('../../models/User')
const authUser = require('../../middlewares/auth')
const Page = require('../../models/Page')
const Contact = require('../../models/Contact')

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

            const contacts = await Contact.findAll()

            return res.render('editPages', {
                user: user.toJSON(),
                userName: user.name,
                avatar: user.avatar ? user.avatar.url : `https://source.unsplash.com/lySzv_cqxH8/60x60`,
                pageId: `page-top`,
                pageTitle: `Editar página`,
                token,
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
                info: pageInfo.toJSON(),
                pages: pages.map((page) => page.toJSON()),
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/login')
        }
    },
}
