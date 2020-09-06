const User = require('../../models/User')
const authUser = require('../../middlewares/auth')
const Page = require('../../models/Page')
const Contact = require('../../models/Contact')
const Product = require('../../models/Product')
const Category = require('../../models/Category')
const Carousel = require('../../models/Carousel')

module.exports = {
    async view(req, res) {
        try {
            const token = req.cookies.token || ''

            if (!token) return res.redirect('/login')

            const { user_id } = await authUser(token)

            const user = await User.findByPk(user_id, { include: { association: `avatar` } })

            const pages = await Page.findAll()

            const contacts = await Contact.findAll()

            const { translate_type } = req.params

            console.log(req.params)

            let typeList

            if (translate_type === `pages`) typeList = await Page.findAll({ include: { association: `translations` } })

            if (translate_type === `products`)
                typeList = await Product.findAll({ include: { association: `translations` } })

            if (translate_type === `categories`)
                typeList = await Category.findAll({ include: { association: `translations` } })

            if (translate_type === `carousels`)
                typeList = await Carousel.findAll({ include: { association: `translations` } })

            const objectToSend = {
                user: user.toJSON(),
                userName: user.name,
                avatar: user.avatar ? user.avatar.url : `https://source.unsplash.com/lySzv_cqxH8/60x60`,
                pageId: `page-top`,
                pageTitle: `Tradução`,
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
                pages: pages.map((page) => page.toJSON()),
                translateType: translate_type,
                translateList: typeList.map((translate) => translate.toJSON()),
                btnClass: `editTranslate`,
            }

            if (translate_type === `carousels`) {
                objectToSend.formFiles = 'true'
                objectToSend.btnClass = `editTranslateCarousel`
            }

            return res.render('pages/translations', objectToSend)
        } catch (error) {
            console.log(error)
            return res.redirect('/login')
        }
    },
}
