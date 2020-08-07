const path = require('path')
const nodemailer = require('nodemailer')
let aws = require('aws-sdk')
const hbs = require('nodemailer-express-handlebars')
const sgTransport = require('nodemailer-sendgrid-transport')

aws.config.update({ region: process.env.AWS_DEFAULT_REGION })

const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendMail = (msg) => {
    return new Promise((resolve, reject) => {
        sgMail
            .send(msg)
            .then((res) => resolve(res))
            .catch((err) => {
                console.log(err.response.body)
                reject({
                    name: `sendGridSender`,
                    message: err.response.body,
                })
            })
    })
}

const sendMailGmail = (msg) => {
    return new Promise((resolve, reject) => {
        sgMail
            .send(msg)
            .then((res) => resolve(res))
            .catch((err) => {
                console.log(err.response.body)
                reject({
                    name: `sendGridSender`,
                    message: err.response.body,
                })
            })
    })
}

/* const msg = {
    to: 'test@example.com',
    from: 'test@example.com',
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
} */

// create Nodemailer SES transporter
// eslint-disable-next-line no-unused-vars
const gmail = {
    host: `smtp.gmail.com`,
    port: 587,
    auth: {
        user: `mateusrectopul@gmail.com`,
        pass: `27m0209R`,
    },
}

const user = process.env.MAIL_USER
const password = process.env.MAIL_PASS
const umbler = {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
}

/* {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
}
 */
/* const transport = nodemailer.createTransport(
    sgTransport({
        auth: {
            api_key: process.env.ADMIN_EMAIL_API_KEY, // your api key here, better hide it in env vars
        },
    })
) */

var transport = nodemailer.createTransport(umbler)

transport.use(
    'compile',
    hbs({
        viewEngine: {
            extName: '.html',
            partialsDir: path.resolve('./src/resources/mail/'),
            layoutsDir: path.resolve('./src/resources/mail/'),
            defaultLayout: false,
        },
        viewPath: path.resolve('./src/resources/mail/'),
        extName: '.html',
    })
)

module.exports = transport
