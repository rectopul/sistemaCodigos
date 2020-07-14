const Users = require('../../models/User')
const User = require('../../models/User')
const Contact = require('../../models/Contact')
const authUser = require('../../middlewares/auth')
const Page = require('../../models/Page')

module.exports = {
    async view(req, res) {
        try {
            const token = req.cookies.token || ''

            if (!token) return res.redirect('/login')

            const { user_id } = await authUser(token)

            const user = await User.findByPk(user_id, { include: { association: `avatar` } })

            //get categories
            const contacts = await Contact.findAll()

            //userName
            const users = await Users.findAll()

            const pages = await Page.findAll()

            return res.render('requests', {
                users: users.map((user) => user.toJSON()),
                userName: user.name,
                avatar: user.avatar ? user.avatar.url : `https://source.unsplash.com/lySzv_cqxH8/60x60`,
                pageId: `page-top`,
                pageTitle: `Solicitações de contato`,
                pages: pages.map((page) => page.toJSON()),
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
                contacts: contacts.map((partner) => {
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
