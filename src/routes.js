const express = require('express')
const multer = require('multer')
const multerConfig = require('./config/multer')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const User = require('./models/User')
const Product = require('./models/Product')

//userbytoken
const authUser = require('./middlewares/auth')

const UserController = require('./controllers/UserController')
//User Image
const UserImageController = require('./controllers/UserImageController')
//products
const ProductController = require('./controllers/ProductController')
//image Products
const ImageProductController = require('./controllers/ImageProductController')
//Files
const FileController = require('./controllers/FileController')
//session
const SessionController = require('./controllers/SessionController')

//Views
const UsersView = require('./controllers/views/UsersViews')

/**
 * Product
 */

const routes = express.Router()

//const credentials = require('./middlewares/UserCredentials')

//Test de rota
routes.get(`/`, (req, res) => {
    return res.status(200).send({ message: `Rota principal` })
})
routes.use(cookieParser())

//Dashboard
routes.get(`/dashboard`, async (req, res) => {
    try {
        const token = req.cookies.token || ''

        if (!token) return res.redirect('/login')

        const { user_id } = await authUser(token)

        const user = await User.findByPk(user_id, { include: { association: `avatar` } })

        const productsCount = await Product.count()

        //userName

        return res.render('dashboard', {
            userName: user.name,
            avatar: user.avatar ? user.avatar.url : `https://source.unsplash.com/lySzv_cqxH8/60x60`,
            productsCount,
            pageId: `page-top`,
            pageTitle: `Dashboard`,
            token,
        })
    } catch (error) {
        console.log(error)
        return res.redirect('/login')
    }
})

//Users
routes.get(`/users`, UsersView.view)
//Products
routes.get(`/products`, async (req, res) => {
    try {
        const { token } = req.cookies

        if (!token) return res.redirect('/login')

        const { user_id } = await authUser(token)

        const user = await User.findByPk(user_id, { include: { association: `avatar` } })

        //products
        const products = await Product.findAll()

        return res.render('products', {
            userName: user.name,
            avatar: user.avatar ? user.avatar.url : `https://source.unsplash.com/lySzv_cqxH8/60x60`,
            pageId: `page-top`,
            pageTitle: `Lista de Produtos`,
            token,
            products: products.map((product) => product.toJSON()),
        })
    } catch (error) {
        console.log(error)
        return res.redirect('/login')
    }
})

//Insert Product
routes.get(`/product_insert`, async (req, res) => {
    try {
        const { token } = req.cookies

        if (!token) return res.redirect('/login')

        const { user_id } = await authUser(token)

        const user = await User.findByPk(user_id, { include: { association: `avatar` } })

        return res.render('insertProduct', {
            userName: user.name,
            avatar: user.avatar ? user.avatar.url : `https://source.unsplash.com/lySzv_cqxH8/60x60`,
            pageId: `page-top`,
            pageTitle: `Cadastro de Produtos`,
            token,
        })
    } catch (error) {
        console.log(error)
        return res.redirect('/login')
    }
})

//Login
routes.get(`/login`, (req, res) => {
    return res.render('login', { pageClasses: `bg-gradient-primary`, pageTitle: `Login` })
})

//logout
routes.get(`/logout`, (req, res) => {
    res.clearCookie('token')

    return res.redirect('/login')
})

//API
//Product
routes.post(`/api/product`, ProductController.store)
routes.get(`/api/product`, ProductController.index)
routes.get(`/api/product/:product_id`, ProductController.show)
//File
routes.post(`/api/file`, multer(multerConfig).single('file'), FileController.read)
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
routes.get('/api/user/:user_id', UserController.single)
routes.post('/api/user/image', multer(multerConfig).single('file'), UserImageController.store)

//session
routes.post(`/api/login`, SessionController.store)

module.exports = routes
