require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
})
//toggled
const express = require('express')
const routes = require('./routes')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const handlebars = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')

require('./database')

const app = express()

//sessão
app.use(
    session({
        secret: `SisCodePassword`,
        resave: true,
        saveUninitialized: true,
    })
)

//config
//template angine
app.engine(
    `handlebars`,
    handlebars({
        defaultLayout: `main`,
        helpers: {
            ifCond: (v1, v2, options) => {
                if (v1 === v2) {
                    return options.fn(this)
                }
                return options.inverse(this)
            },
            printArray: function (arr) {
                for (i = 0; i < arr.length; i++) {
                    console.log(arr[i])
                }
            },
        },
    })
)

//flash
app.use(flash())

//middleware sessions
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')

    next()
})

app.set(`view engine`, `handlebars`)
app.set('views', path.join(__dirname, 'views'))

//Public
app.use(express.static(path.resolve(__dirname, 'public')))

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))
//app.use(morgan('dev'))
app.use(routes)

app.use((req, res) => {
    res.status(404).send({ url: req.originalUrl + ' not found' })
})

app.listen(process.env.PORT || 3333)
