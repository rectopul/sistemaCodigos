const UserImage = require('../models/UserImage')
const UserByToken = require('../middlewares/userByToken')

module.exports = {
    async index(req, res) {
        const { id_product: product_id } = req.params
        console.log(product_id)
        const images = await UserImage.findAll({ where: { product_id } })

        return res.json(images)
    },

    async delete(req, res) {
        const image = await UserImage.findByPk(req.params.id)

        if (!image) {
            return res.status(200).json({ message: 'Image not exist ' })
        }

        await UserImage.destroy({
            where: {
                id: req.params.id,
            },
            individualHooks: true,
        })
            .then(() => {
                return res.send()
            })
            .catch((err) => {
                console.log(err)
            })
    },

    async store(req, res) {
        try {
            const authHeader = req.headers.authorization

            const { user_id } = await UserByToken(authHeader)

            let { originalname: name, size, key, location: url = '' } = req.file

            const image = await UserImage.create({
                name,
                size,
                key,
                url,
                user_id,
            })

            return res.json(image)
        } catch (error) {}
    },
}
