const Users = require('../../models/User')
const User = require('../../models/User')
const Partner = require('../../models/Partner')
const authUser = require('../../middlewares/auth')
const Page = require('../../models/Page')
const Contact = require('../../models/Contact')

module.exports = {
    async view(req, res) {
        try {
            const token = req.cookies.token || ''

            if (!token) return res.redirect('/login')

            const { user_id } = await authUser(token)

            const user = await User.findByPk(user_id, { include: { association: `avatar` } })

            //get categories
            const partners = await Partner.findAll({ include: { association: `image` } })

            //userName
            const users = await Users.findAll()

            const pages = await Page.findAll()

            const contacts = await Contact.findAll()

            return res.render('partners', {
                users: users.map((user) => user.toJSON()),
                userName: user.name,
                avatar: user.avatar ? user.avatar.url : `https://source.unsplash.com/lySzv_cqxH8/60x60`,
                pageId: `page-top`,
                pageTitle: `Parceiros`,
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
                partners: partners.map((partner) => {
                    const parceiro = partner.toJSON()
                    const { createdAt } = parceiro

                    const data = new Intl.DateTimeFormat('pt-BR').format(createdAt)

                    parceiro.createdAt = data

                    return parceiro
                }),
                token,
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/login')
        }
    },
}
