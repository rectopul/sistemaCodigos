const fs = require('fs')
const readline = require('readline')
const { promisify } = require('util')
const path = require('path')
const Code = require('../models/Code')
const { Op } = require('sequelize')

module.exports = {
    async read(req, res, err) {
        try {
            let { originalname: name, size, key, location: url = '' } = req.file
            console.log('File: ', req.file)
            let lineReader = readline.createInterface({
                input: fs.createReadStream(req.file.path || req.file.location),
            })

            var list = []

            await lineReader.on('line', function (line) {
                list.push({ text: line.toString() })
            })

            lineReader.on('close', async function () {
                await promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', key))

                const codes = list.map((item) => item.text)

                const checkItem = await Code.findAll({
                    where: {
                        code: {
                            [Op.in]: codes,
                        },
                    },
                })

                console.log(checkItem.map((item) => item.toJSON()))

                if (checkItem.length)
                    return res
                        .status(400)
                        .json({ error: `One or more codes already exist`, codes: checkItem.map((code) => code.code) })

                return res.json(list)
            })
        } catch (error) {
            console.log('Nome do erro: ', error)
            return res.status(400).send({ error: error.message })
        }
    },
}
