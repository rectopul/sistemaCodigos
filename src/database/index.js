const Sequelize = require('sequelize')
const dbConfig = require('../config/database')

const connection = new Sequelize(dbConfig)

const User = require('../models/User')
const UserImage = require('../models/UserImage')
const Product = require('../models/Product')
const ProductImages = require('../models/ImageProduct')
const ProductIten = require('../models/ProductItem')
const Code = require('../models/Code')
const Category = require('../models/Category')
const ProductCategory = require('../models/ProductCategory')
const Search = require('../models/Search')
const Page = require('../models/Page')
const Subscriber = require('../models/Subscriber')
const Banner = require('../models/Banner')
const BannerImage = require('../models/BannerImage')
const Image = require('../models/Image')
const Partner = require('../models/Partner')
const Contact = require('../models/Contact')
const Carousel = require('../models/Carousel')
const Bull = require('../models/Bull')
const Translations = require('../models/Translation')
const Whatsapp = require('../models/Whatsapp')

//user
User.init(connection)
Whatsapp.init(connection)
Translations.init(connection)
UserImage.init(connection)
Product.init(connection)
ProductImages.init(connection)
ProductIten.init(connection)
Code.init(connection)
Category.init(connection)
ProductCategory.init(connection)
Search.init(connection)
Page.init(connection)
Subscriber.init(connection)
Banner.init(connection)
BannerImage.init(connection)
Image.init(connection)
Partner.init(connection)
Contact.init(connection)
Carousel.init(connection)
Bull.init(connection)

//associations
Product.associate(connection.models)
User.associate(connection.models)
UserImage.associate(connection.models)
ProductImages.associate(connection.models)
ProductIten.associate(connection.models)
Code.associate(connection.models)
Category.associate(connection.models)
ProductCategory.associate(connection.models)
Search.associate(connection.models)
Page.associate(connection.models)
Banner.associate(connection.models)
BannerImage.associate(connection.models)
Image.associate(connection.models)
Partner.associate(connection.models)
Carousel.associate(connection.models)
Bull.associate(connection.models)
Translations.associate(connection.models)
Whatsapp.associate(connection.models)

module.exports = connection
