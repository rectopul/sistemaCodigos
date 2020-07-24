const BannerImage = require('../models/BannerImage')
const UserByToken = require('../middlewares/userByToken')

module.exports = {
    async store(req, res) {
        try {
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            let { originalname: name, size, key, location: url = '' } = req.file

            const image = await BannerImage.create({
                name,
                size,
                key,
                url,
                default: false,
            })

            return res.json(image)
        } catch (error) {
            console.log(`Erro ao inserir imagem de produto: `, error)
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao inserir imagem de produto: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },
}
