const ImgProducts = require('../models/ImageProduct')
const UserByToken = require('../middlewares/userByToken')

module.exports = {
    async index(req, res) {
        const { id_product: product_id } = req.params
        const images = await ImgProducts.findAll({ where: { product_id } })

        return res.json(images)
    },

    async delete(req, res) {
        const image = await ImgProducts.findByPk(req.params.id)

        if (!image) {
            return res.status(200).json({ message: 'Image not exist ' })
        }

        await ImgProducts.destroy({
            where: {
                id: req.params.id,
            },
            individualHooks: true,
        })
            .then(() => {
                return res.send()
            })
            .catch((err) => {})
    },

    async store(req, res) {
        try {
            const authHeader = req.headers.authorization

            const { user_id } = await UserByToken(authHeader)

            let { originalname: name, size, key, location: url = '' } = req.file

            const image = await ImgProducts.create({
                name,
                size,
                key,
                url,
                default: false,
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

            console.log(`Erro ao inserir imagem de produto: `, error)

            return res.status(500).send({ error: `Erro de servidor` })
        }
    },
}
