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
const requestIp = require('request-ip')

require('./database')

const app = express()

app.use(requestIp.mw())

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
            first: (list, index, options) => {
                if (list.length) {
                    if (list[0][index]) return list[0][index]
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
            check: (v1, options) => {
                if (v1 === true) {
                    return options.fn(this)
                }
                return options.inverse(this)
            },
            carousel: (arr, options) => {
                const myParam = options.data.root.language
                if (arr.length) {
                    return arr.map((item, key) => {
                        if (key < 1) {
                            return `
                            <div class="carousel-item active">
                                <a href="${item.url || `/`}?lang=${myParam}">
                                    <img src="${item.image.url}" class="d-block w-100" alt="...">
                                </a>
                            </div>`
                        } else {
                            return `
                            <div class="carousel-item">
                                <a href="${item.url || `/`}?lang=${myParam}">
                                    <img src="${item.image.url}" class="d-block w-100" alt="...">
                                </a>
                            </div>`
                        }
                    })
                }
            },
            dropDown: (arr, options) => {
                let ul = `<ul class="dropdown-menu">`
                var text = ``

                const myParam = options.data.root.language

                if (arr.length) {
                    for (i = 0; i < arr.length; i++) {
                        text += `
                        <li ${arr[i].child.length ? `class="dropdown-submenu"` : ``}>
                            <a href="/products/${arr[i].slug}?lang=${myParam}" ${
                            arr[i].child.length ? `class="dropdown-toggle" data-toggle="dropdown"` : ``
                        }>${arr[i].name}
                        ${arr[i].child.length ? `<i class="arrow"></i>` : ``}
                        </a>
                        `

                        if (arr[i].child.length) {
                            text += `<ul class="dropdown-menu">`
                            for (b = 0; b < arr[i].child.length; b++) {
                                text += `
                                <li ${arr[i].child[b].child.length ? `class="dropdown-submenu"` : ``} >
                                    <a href="/products/${arr[i].child[b].slug}?lang=${myParam}" ${
                                    arr[i].child[b].child.length ? `class="dropdown-toggle" data-toggle="dropdown"` : ``
                                }>${arr[i].child[b].name}
                                ${arr[i].child[b].child.length ? `<i class="arrow"></i>` : ``}
                                </a>
                                `

                                if (arr[i].child[b].child.length) {
                                    text += `<ul class="dropdown-menu">`
                                    for (c = 0; c < arr[i].child[b].child.length; c++) {
                                        text += `
                                        <li>
                                            <a href="/products/${arr[i].child[b].child[c].slug}?lang=${myParam}">${arr[i].child[b].child[c].name}</a>
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
            flags: (options) => {
                //html
                const lang = options.data.root.language

                let render = `
                <div class="languagesList">
                    <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <img src="/img/brasil.png" alt="">
                        </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <a class="dropdown-item" href="?lang=esp">
                                <img src="/img/espanhol.png" alt="">
                                ESP
                            </a>
                            <a class="dropdown-item" href="?lang=en">
                                <img src="/img/ingles.png" alt="">
                                EN
                            </a>
                        </div>
                    </div>
                </div>
                `

                if (lang && lang === `en`) {
                    render = `
                    <div class="languagesList">
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src="/img/ingles.png" alt="">
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <a class="dropdown-item" href="?lang=esp">
                                    <img src="/img/espanhol.png" alt="">
                                    ESP
                                </a>
                                <a class="dropdown-item" href="?lang=">
                                    <img src="/img/brasil.png" alt="">
                                    BR
                                </a>
                            </div>
                        </div>
                    </div>
                    `
                }

                if (lang && lang === `esp`) {
                    render = `
                    <div class="languagesList">
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src="/img/espanhol.png" alt="">
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <a class="dropdown-item" href="?lang=en">
                                    <img src="/img/ingles.png" alt="">
                                    EN
                                </a>
                                <a class="dropdown-item" href="?lang=">
                                    <img src="/img/brasil.png" alt="">
                                    BR
                                </a>
                            </div>
                        </div>
                    </div>
                    `
                }

                return render
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
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: true, limit: '100mb' }))
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))
//app.use(morgan('dev'))
app.use(routes)

app.use((req, res) => {
    // /errorView
    res.render('404')
    //res.status(404).send({ url: req.originalUrl + ' not found' })
})

app.listen(process.env.PORT || 3333)
