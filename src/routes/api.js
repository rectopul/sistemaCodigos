const routes = require('express').Router()

const multer = require('multer')
const multerConfig = require('../config/multer')
const multerText = require('../config/multerText')

const UserController = require('../controllers/UserController')
//User Image
const UserImageController = require('../controllers/UserImageController')
//products
const ProductController = require('../controllers/ProductController')
//image Products
const ImageProductController = require('../controllers/ImageProductController')
//Files
const FileController = require('../controllers/FileController')
//session
const SessionController = require('../controllers/SessionController')
//categories
const CategoryController = require('../controllers/CategoryController')
//Searches
const SearchController = require('../controllers/SearchController')

//Pages
const PageController = require('../controllers/PageController')

//Newsletter
const Subscriber = require('../controllers/SubscriberController')

//Images
const ImageController = require('../controllers/ImageController')

//Partner
const PartnerController = require('../controllers/PartnerController')

//Banners
const BannerController = require('../controllers/BannerController')
const BannerImageController = require('../controllers/BannerImageController')

//Contato
const ContactController = require('../controllers/ContactController')
//Carousel
const CarouselController = require('../controllers/CarouselController')

const ProductCodeController = require('../controllers/ProductCodeController')

const BullController = require('../controllers/BullController')

//API
//Product
routes.post(`/api/product`, ProductController.store)
routes.get(`/api/product`, ProductController.index)
routes.delete(`/api/product/:product_id`, ProductController.destroy)
routes.get(`/api/product/:product_id`, ProductController.show)
routes.put(`/api/product/:product_id`, ProductController.update)
routes.post(`/api/product-item/:product_id`, ProductCodeController.store)
//Bula
routes.post(`/api/bull`, multer(multerText).single('file'), BullController.store)
routes.put(`/api/bull/:product_id`, multer(multerText).single('file'), BullController.update)
//codes
routes.delete(`/api/code/:code_id`, ProductCodeController.destroy)
//File
routes.post(`/api/file`, multer(multerText).single('file'), FileController.read)
/* Forgot e Recuperação de senha */
routes.post('/api/forgot', UserController.forgot)
routes.post('/api/reset_password', UserController.reset)

/* Images Products */
routes.post('/api/image/product/:product_id?', multer(multerConfig).array('file', 12), ImageProductController.store)
routes.get('/api/image/product/:id_product', ImageProductController.index)
routes.delete('/api/image/product/:id', ImageProductController.delete)

//somente superuser
//routes.use(credentials)
routes.get('/api/user', UserController.index)
routes.post('/api/user', UserController.store)
routes.put('/api/user', UserController.update)
routes.delete('/api/user/:user_id', UserController.destroy)
routes.get('/api/user/:user_id', UserController.single)
routes.post('/api/user/image/:user_id', multer(multerConfig).single('file'), UserImageController.store)
routes.put('/api/user/image', multer(multerConfig).single('file'), UserImageController.edit)
routes.post('/api/forgot', UserController.forgot)
routes.post('/api/reset', UserController.reset)
//categories
routes.post(`/api/category`, CategoryController.store)
routes.get(`/api/category/:categori_id`, CategoryController.show)
routes.get(`/api/category`, CategoryController.index)
routes.delete(`/api/category/:category_id`, CategoryController.destroy)
routes.put(`/api/category/:category_id`, CategoryController.edit)
//Consultas
routes.post(`/api/search`, SearchController.store)
routes.get(`/api/search`, SearchController.index)
routes.get(`/api/search/:search_id`, SearchController.show)
//Páginas
routes.post(`/api/page`, PageController.store)
routes.put(`/api/page/:page_id`, PageController.update)
//newsletter
routes.post(`/api/subscriber`, Subscriber.store)
//Banners
routes.post(`/api/banner/:page_id`, BannerController.store)
routes.put(`/api/banner/:banner_id`, BannerController.update)
routes.post(`/api/banner-image`, multer(multerConfig).single('file'), BannerImageController.store)
//images
routes.post(`/api/image`, multer(multerConfig).single('file'), ImageController.store)
//parceiro
routes.post(`/api/partner`, PartnerController.store)
routes.delete(`/api/partner/:partner_id`, PartnerController.destroy)
routes.get(`/api/partner/:partner_id`, PartnerController.show)
routes.put(`/api/partner/:partner_id`, PartnerController.update)
//Contact
routes.delete(`/api/contact/:contact_id`, ContactController.destroy)
routes.put(`/api/contact/:contact_id`, ContactController.update)
routes.get(`/api/contact/:contact_id`, ContactController.show)
routes.get(`/api/contact`, ContactController.index)
routes.post(`/api/contact`, ContactController.store)
//Carousel
routes.post(`/api/carousel/image`, multer(multerConfig).single('file'), ImageController.store)
routes.post(`/api/carousel`, CarouselController.store)
routes.put(`/api/carousel/:carousel_id`, CarouselController.update)
routes.put(`/api/carousel_image/:carousel_id`, multer(multerConfig).single('file'), CarouselController.imageUpdate)
routes.delete(`/api/carousel/:carousel_id`, CarouselController.destroy)
//session
routes.post(`/api/login`, SessionController.store)

module.exports = routes
