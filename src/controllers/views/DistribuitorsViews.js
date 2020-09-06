const Category = require('../../models/Category')
const { Op } = require('sequelize')
const Page = require('../../models/Page')
const Partner = require('../../models/Partner')
const Contact = require('../../models/Contact')
const partialTranslations = require('../../modules/translate')
const Whatsapp = require('../../models/Whatsapp')
const Translation = require('../../models/Translation')

module.exports = {
    async view(req, res) {
        try {
            const { lang: language } = req.query
            const categories = await Category.findAll({
                where: {
                    parent: {
                        [Op.eq]: null,
                    },
                    slug: {
                        [Op.not]: `oculto`,
                    },
                },
                order: [['position', 'ASC']],
                include: {
                    association: `child`,
                    order: [['position', 'ASC']],
                    include: { association: `child`, order: [['position', 'ASC']] },
                },
            })

            const page = await Page.findOne({ where: { slug: 'distribuidores' } })

            if (language) {
                const translate = await Translation.findOne({
                    where: {
                        page_id: page.id,
                        language,
                    },
                })

                if (translate) page.content = translate.text
                if (translate) page.title = translate.title

                //translate category
                categories.map(async (category) => {
                    const _translate = await Translation.findOne({
                        where: {
                            category_id: category.id,
                            language,
                        },
                    })

                    if (_translate) {
                        category.description = _translate.text
                        category.name = _translate.title
                    }

                    //translate child
                    category.child.map(async (child) => {
                        const __translate = await Translation.findOne({
                            where: {
                                category_id: child.id,
                                language,
                            },
                        })

                        if (__translate) {
                            child.description = __translate.text
                            child.name = __translate.title
                        }
                    })
                })
            }

            const partners = await Partner.findAll({ order: [['position', 'ASC']] })

            const contacts = await Contact.findAll()

            const whatsapp = await Whatsapp.findAll()

            return res.render('distributors', {
                pageTitle: `Distribuidores`,
                categories,
                pageType: `site`,
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
                page: page.toJSON(),
                partners: partners.map((partner) => partner.toJSON()),
                partials: partialTranslations(language),
                whatsapp: whatsapp[0].toJSON(),
                language: language || ``,
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/404')
        }
    },
}
