const Sequelize = require('sequelize')
const dbConfig = require('../config/database')

const connection = new Sequelize(dbConfig)

const User = require('../models/User')
const UserImage = require('../models/UserImage')
const Product = require('../models/Product')
const ProductImages = require('../models/ImageProduct')

//user
User.init(connection)
UserImage.init(connection)
Product.init(connection)
ProductImages.init(connection)

//associations
User.associate(connection.models)
UserImage.associate(connection.models)
ProductImages.associate(connection.models)

module.exports = connection
