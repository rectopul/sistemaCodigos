const routes = require('express').Router()

const { Op } = require('sequelize')

const User = require('../models/User')
const Product = require('../models/Product')

//userbytoken
const authUser = require('../middlewares/auth')

//Profile
const ProfileView = require('../controllers/views/ProfileView')
//categories
const Category = require('../models/Category')
//Searches
const SearchView = require('../controllers/views/searchViews')
const Search = require('../models/Search')

//Pages
const Page = require('../models/Page')

//Views
const UsersView = require('../controllers/views/UsersViews')

const CategoryView = require('../controllers/views/CategoriesViews')

const Subscribers = require('../models/Subscriber')
const SubscribersView = require('../controllers/views/EmailViews')

const PageProducts = require('../controllers/views/ProductsView')
const NewPageView = require('../controllers/views/newPageView')
const EditPageView = require('../controllers/views/EditPageView')

//Consultas
const SearchesController = require('../controllers/views/ConsultsView')

//Dashboard
routes.get(`/dashboard`, async (req, res) => {
    try {
        const token = req.cookies.token || ''

        if (!token) return res.redirect('/login')

        const { user_id } = await authUser(token)

        const user = await User.findByPk(user_id, { include: { association: `avatar` } })

        const totalSearchs = await Search.count()

        const subscribers = await Subscribers.count()

        const productsCount = await Product.count()

        const pages = await Page.findAll()

        //userName

        return res.render('dashboard', {
            userName: user.name,
            avatar: user.avatar ? user.avatar.url : `https://source.unsplash.com/lySzv_cqxH8/60x60`,
            productsCount,
            pageId: `page-top`,
            pageTitle: `Dashboard`,
            totalSearchs,
            token,
            pages: pages.map((page) => page.toJSON()),
            subscribers,
        })
    } catch (error) {
        console.log(error)
        return res.redirect('/login')
    }
})

routes.get(`/seachs`, SearchesController.view)

routes.get(`/subscribers`, SubscribersView.view)

routes.get(`/new-page`, NewPageView.view)
routes.get(`/edit-page/:page_slug`, EditPageView.view)

//search
routes.get(`/search`, SearchView.view)
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
        const products = await Product.findAll({
            order: [['updatedAt', 'DESC']],
            include: { association: `image`, where: { default: true }, limit: 1 },
        })

        const pages = await Page.findAll()

        return res.render('products', {
            userName: user.name,
            avatar: user.avatar ? user.avatar.url : `https://source.unsplash.com/lySzv_cqxH8/60x60`,
            pageId: `page-top`,
            pageTitle: `Lista de Produtos`,
            token,
            products: products.map((product) => product.toJSON()),
            pages: pages.map((page) => page.toJSON()),
        })
    } catch (error) {
        console.log(error)
        return res.redirect('/login')
    }
})
routes.get(`/products/:category_slug`, PageProducts.view)
//Categories
routes.get(`/category`, CategoryView.view)

//Insert Product
routes.get(`/product_insert`, async (req, res) => {
    try {
        const { token } = req.cookies

        if (!token) return res.redirect('/login')

        const { user_id } = await authUser(token)

        const user = await User.findByPk(user_id, { include: { association: `avatar` } })

        const categories = await Category.findAll({
            where: {
                parent: {
                    [Op.eq]: null,
                },
            },
            include: { association: `child`, include: { association: `child` } },
        })
        const pages = await Page.findAll()

        return res.render('insertProduct', {
            userName: user.name,
            avatar: user.avatar ? user.avatar.url : `https://source.unsplash.com/lySzv_cqxH8/60x60`,
            pageId: `page-top`,
            pageTitle: `Cadastro de Produtos`,
            token,
            categories: categories.map((category) => category.toJSON()),
            pages: pages.map((page) => page.toJSON()),
        })
    } catch (error) {
        console.log(error)
        return res.redirect('/login')
    }
})

//Profile
routes.get(`/profile`, ProfileView.view)

//Login
routes.get(`/login`, (req, res) => {
    const rcSiteKey = process.env.RECAPTCHA_SITE_KEY
    const secretKey = process.env.RECAPTCHA_SITE_KEY
    console.log(req.ips)
    return res.render('login', { pageClasses: `bg-gradient-primary`, pageTitle: `Login`, rcSiteKey, secretKey })
})

//forgot password
routes.get(`/forgot`, (req, res) => res.render('forgot'))

//logout
routes.get(`/logout`, (req, res) => {
    res.clearCookie('token')

    return res.redirect('/login')
})

module.exports = routes
