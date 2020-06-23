const Sequelize = require('sequelize')
const dbConfig = require('../config/database')

const connection = new Sequelize(dbConfig)

const User = require('../models/User')

//user
User.init(connection)
User.associate(connection.models)

module.exports = connection
