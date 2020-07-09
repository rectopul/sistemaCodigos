const Subscriber = require('../models/Subscriber')
const Mailchimp = require('../modules/mailchimp')

module.exports = {
    async store(req, res, err) {
        try {
            const { name: fullname, email } = req.body

            if (!fullname && !email) return res.status(400).send({ error: `please enter the title and content` })

            const [name, surname] = fullname.split(' ')

            //check if e-mail aready exist
            const checkMail = await Subscriber.findOne({ where: { email } })

            if (checkMail) return res.status(400).send({ error: `Este e-mail já está cadastrado` })

            await Mailchimp.store({ name: fullname, email })

            const subscriber = await Subscriber.create({ name, surname, email, status: `subscribed` })

            return res.json(subscriber)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao criar novo produto: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },
}
