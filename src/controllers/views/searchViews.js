const Users = require('../../models/User')
const User = require('../../models/User')
const Product = require('../../models/Product')
const authUser = require('../../middlewares/auth')
const Category = require('../../models/Category')
const log = require('debug')('api:main')

module.exports = {
    async view(req, res) {
        try {
            return res.render('search', {
                pageId: `page-top`,
                pageTitle: `Pesquisar Código`,
            })
        } catch (error) {
            log('error in access search page: ', error)
            return res.redirect('/login')
        }
    },
}
