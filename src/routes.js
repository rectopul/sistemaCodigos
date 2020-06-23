const express = require('express')
const multer = require('multer')
const multerConfig = require('./config/multer')

const UserController = require('./controllers/UserController')
//image Products
const ImageProductController = require('./controllers/ImageProductController')

/**
 * Product
 */

const routes = express.Router()

//const credentials = require('./middlewares/UserCredentials')

//Test de rota
routes.get(`/`, (req, res) => {
    return res.status(200).send({ message: `Rota principal` })
})

//Dashboard
routes.get(`/dashboard`, (req, res) => {
    return res.render('dashboard', { pageClasses: ``, pageTitle: `Dashboard` })
})

//Login
routes.get(`/login`, (req, res) => {
    return res.render('login', { pageClasses: `bg-gradient-primary`, pageTitle: `Login` })
})

/* Forgot e Recuperação de senha */
routes.post('/api/forgot', UserController.forgot)
routes.post('/api/reset_password', UserController.reset)

/* Images Products */
routes.post('/api/image/product', multer(multerConfig).single('file'), ImageProductController.store)
routes.get('/api/image/product/:id_product', ImageProductController.index)
routes.delete('/api/image/product/:id', ImageProductController.delete)

//somente superuser
//routes.use(credentials)
routes.get('/api/user', UserController.index)
routes.post('/api/user', UserController.store)
routes.get('/api/user', UserController.single)

module.exports = routes
