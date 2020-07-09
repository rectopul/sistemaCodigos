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
const https = require('https')
const fs = require('fs')

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
            contains: (list, string, options) => {
                if (list === string) {
                    return options.fn(this)
                }
                return options.inverse(this)
            },
            printArray: function (arr) {
                for (i = 0; i < arr.length; i++) {
                    console.log(arr[i])
                }
            },
            dropDown: (arr) => {
                let ul = `<ul class="dropdown-menu">`
                var text = ``
                if (arr.length) {
                    for (i = 0; i < arr.length; i++) {
                        text += `
                        <li ${arr[i].child.length ? `class="dropdown-submenu"` : ``}>
                            <a href="/products/${arr[i].slug}" ${
                            arr[i].child.length ? `class="dropdown-toggle" data-toggle="dropdown"` : ``
                        }>${arr[i].name}</a>`

                        if (arr[i].child.length) {
                            text += `<ul class="dropdown-menu">`
                            for (b = 0; b < arr[i].child.length; b++) {
                                text += `
                                <li ${arr[i].child[b].child.length ? `class="dropdown-submenu"` : ``} >
                                    <a href="/products/${arr[i].child[b].slug}" ${
                                    arr[i].child[b].child.length ? `class="dropdown-toggle" data-toggle="dropdown"` : ``
                                }>${arr[i].child[b].name}</a>`

                                if (arr[i].child[b].child.length) {
                                    text += `<ul class="dropdown-menu">`
                                    for (c = 0; c < arr[i].child[b].child.length; c++) {
                                        text += `
                                        <li>
                                            <a href="/products/${arr[i].child[b].child[c].slug}">${arr[i].child[b].child[c].name}</a>
                                        </li>`
                                    }
                                    text += `</ul></li>`
                                } else {
                                    text += `</li>`
                                }
                            }
                            text += `</ul></li>`
                        } else {
                            text += `</li>`
                        }
                    }
                    ul += text

                    return (ul += `</ul>`)
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

/* https
    .createServer(
        {
            key: fs.readFileSync('src/key.pem'),
            cert: fs.readFileSync('src/cert.pem'),
            passphrase: '1234',
        },
        app
    ) */
app.listen(process.env.PORT || 3333)
