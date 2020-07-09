const express = require('express')
const cookieParser = require('cookie-parser')
const pages = require('./pages')
const api = require('./api')

//Pages
const Index = require('../controllers/views/indexView')

const routes = express.Router()

//const credentials = require('./middlewares/UserCredentials')

//Test de rota
routes.get(`/`, Index.view)
routes.use(cookieParser())

routes.use(pages)
routes.use(api)

module.exports = routes
