const fs = require('fs')
const readline = require('readline')
const { promisify } = require('util')
const path = require('path')
const Code = require('../models/Code')
const { Op } = require('sequelize')

module.exports = {
    async store(req, res) {
        try {
            const { code, ip, city, region } = req.body
            require('dns').reverse(req.connection.remoteAddress, function (err, domains) {
                console.log(domains)

                let oldDevice = req.headers['user-agent']

                console.log(`Old device`, oldDevice)

                const size = oldDevice.indexOf(')') - oldDevice.indexOf('(')

                console.log(`size`, size)

                let device = oldDevice.substr(oldDevice.indexOf('(') + 1, size - 1)
                return res.json({
                    code,
                    ip,
                    city,
                    region,
                    device,
                })
            })
        } catch (error) {
            console.log('Nome do erro: ', error)
            return res.status(400).send({ error: error.message })
        }
    },
}
