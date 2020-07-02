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

//user
User.init(connection)
UserImage.init(connection)
Product.init(connection)
ProductImages.init(connection)
ProductIten.init(connection)
Code.init(connection)
Category.init(connection)
ProductCategory.init(connection)
Search.init(connection)

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

module.exports = connection
