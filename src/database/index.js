const Sequelize = require('sequelize')
const dbConfig = require('../config/database')

const connection = new Sequelize(dbConfig)

const User = require('../models/User')
const UserImage = require('../models/UserImage')
const Product = require('../models/Product')
const ProductImages = require('../models/ImageProduct')
const ProductIten = require('../models/ProductItem')
const Code = require('../models/Code')

//user
User.init(connection)
UserImage.init(connection)
Product.init(connection)
ProductImages.init(connection)
ProductIten.init(connection)
Code.init(connection)

//associations
Product.associate(connection.models)
User.associate(connection.models)
UserImage.associate(connection.models)
ProductImages.associate(connection.models)
ProductIten.associate(connection.models)
Code.associate(connection.models)

module.exports = connection
