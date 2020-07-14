const Image = require('../models/Image')
const UserByToken = require('../middlewares/userByToken')

module.exports = {
    async index(req, res) {
        try {
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            const images = await Image.findAll({ include: { association: `partner` } })

            return res.json(images)
        } catch (error) {}
    },
    async show(req, res) {
        try {
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            const { image_id } = req.params

            const image = await Image.findByPk(image_id, { include: { association: `partner` } })

            if (!image) return res.status(200).json({ message: 'Image not exist ' })

            return res.json(image)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao selecionar imagem: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async delete(req, res) {
        try {
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            const image = await Image.findByPk(req.params.id)

            if (!image) return res.status(200).json({ message: 'Image not exist ' })

            await image.destroy()

            return res.json(image)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao deletar imagem: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async store(req, res) {
        try {
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            let { originalname: name, size, key, location: url = '' } = req.file

            const image = await Image.create({
                name,
                size,
                key,
                url,
            })

            return res.json(image)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao criar imagem: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },

    async update(req, res) {
        try {
            const authHeader = req.headers.authorization

            await UserByToken(authHeader)

            const { image_id } = req.params

            //check if image exist

            const image = await Image.findByPk(image_id)

            if (!image) return res.status(400).send({ error: `This image not exist` })

            let { originalname: name, size, key, location: url = '' } = req.file

            await image.update({
                name,
                size,
                key,
                url,
            })

            return res.json(image)
        } catch (error) {
            //Validação de erros
            if (error.name == `JsonWebTokenError`) return res.status(400).send({ error })

            if (
                error.name == `SequelizeValidationError` ||
                error.name == `SequelizeUniqueConstraintError` ||
                error.name == `userToken`
            )
                return res.status(400).send({ error: error.message })

            console.log(`Erro ao atualizar imagem: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },
}
