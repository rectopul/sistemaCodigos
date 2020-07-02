const Code = require('../models/Code')

module.exports = {
    async store(req, res) {
        try {
            const { code, ip, city, region } = req.body
            let oldDevice = req.headers['user-agent']

            const size = oldDevice.indexOf(')') - oldDevice.indexOf('(')

            let device = oldDevice.substr(oldDevice.indexOf('(') + 1, size - 1)

            //consult code
            const search = await Code.findOne({
                where: { code },
                include: [{ association: `item` }, { association: `product` }],
            })

            if (!search) return res.status(400).send({ error: `Código não existe` })

            return res.json({
                code,
                product: search.product,
                item: search.item,
                ip,
                city,
                region,
                device,
            })
        } catch (error) {
            console.log('Nome do erro: ', error)
            return res.status(400).send({ error: error.message })
        }
    },
}
