const fs = require('fs')
const readline = require('readline')
const { promisify } = require('util')
const path = require('path')

module.exports = {
    async read(req, res, err) {
        try {
            let { originalname: name, size, key, location: url = '' } = req.file
            //console.log('File: ', url)
            let lineReader = readline.createInterface({
                input: fs.createReadStream(req.file.path),
            })

            var list = []

            await lineReader.on('line', function (line) {
                list.push({ text: line.toString() })
            })

            lineReader.on('close', async function () {
                await promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', key))
                return res.json(list)
            })
        } catch (error) {
            console.log('Nome do erro: ', error.name)
            return res.status(400).send({ error: error.message })
        }
    },
}
