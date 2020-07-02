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
                return res.json({
                    code,
                    ip,
                    city,
                    region,
                    device: req.headers['user-agent'],
                })
            })
        } catch (error) {
            console.log('Nome do erro: ', error)
            return res.status(400).send({ error: error.message })
        }
    },
}
