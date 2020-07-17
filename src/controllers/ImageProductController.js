const ImgProducts = require('../models/ImageProduct')
const Product = require('../models/Product')
const UserByToken = require('../middlewares/userByToken')

module.exports = {
    async index(req, res) {
        const { id_product: product_id } = req.params
        const images = await ImgProducts.findAll({ where: { product_id } })

        return res.json(images)
    },

    async delete(req, res) {
        try {
            const authHeader = req.headers.authorization

            const { user_id } = await UserByToken(authHeader)

            const image = await ImgProducts.findByPk(req.params.id)

            if (!image) return res.status(200).json({ message: 'Image not exist ' })

            //check exist images
            const productImages = await Product.findByPk(image.product_id, { include: { association: `image` } })

            await image.destroy()

            if (productImages.image.length) {
                const defaultImg = productImages.image.map((img) => {
                    if (img.default == true) return img.toJSON()
                })

                if (!defaultImg[0]) {
                    imageDefault = await ImgProducts.findOne({ where: { product_id: productImages.id } })

                    imageDefault.update({ default: true })
                }
            }

            return res.json(image)
        } catch (error) {
            console.log(error)
        }
    },

    async store(req, res) {
        try {
            const authHeader = req.headers.authorization

            const { user_id } = await UserByToken(authHeader)

            const { product_id } = req.params

            const files = [...req.files]

            const save = files.map(async (file, i) => {
                let { originalname: name, size, key, location: url = '' } = file

                let image

                if (product_id) {
                    //check if has img default
                    const imageDefault = ImgProducts.findAll({ where: { product_id, default: true } })

                    let paramDefault = false

                    if (!imageDefault.length) {
                        if (i === 0) paramDefault = true
                    }

                    image = await ImgProducts.create({
                        name,
                        size,
                        key,
                        product_id,
                        url,
                        default: paramDefault,
                    })
                } else {
                    image = await ImgProducts.create({
                        name,
                        size,
                        key,
                        url,
                        default: i === 0 ? true : false,
                    })
                }

                return image
            })

            const response = await Promise.all(save)

            return res.json(response)
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
