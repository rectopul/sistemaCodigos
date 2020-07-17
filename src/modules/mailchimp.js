const apiUrl = process.env.MAILCHIMP_API_URL
const key = process.env.MAILCHIMP_KEY
const listId = process.env.MAILCHIMP_LIST_ID
const auth = process.env.MAILCHIMP_AUTH
const [, dc] = key.split('-')
//Rastreamento correios
const request = require('request')

module.exports = {
    //Get all lists
    async list() {
        return new Promise((resolve, reject) => {
            const path = `lists`

            const options = {
                url: `https://${dc}.api.mailchimp.com/3.0/${path}`,
                Method: `GET`,
                headers: {
                    authorization: `Basic key`,
                },
            }

            request(options, (error, response, body) => {
                if (error) return reject(`Erro`, error)

                list = JSON.parse(response.toJSON().body)

                console.log(list.status)

                if (list.status == 401) return reject({ name: `mailchimpError`, message: list.detail })

                return resolve(list)
            })
        })
    },

    async store(member) {
        return new Promise((resolve, reject) => {
            const path = `lists/${listId}/members/`

            const { email: email_address, name: fullname } = member

            const [name, surname] = fullname.split(' ')

            //return console.log(name)

            const members = {
                email_address,
                status: 'subscribed',
                merge_fields: {
                    FNAME: name,
                    LNAME: surname,
                },
            }

            const options = {
                url: `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members/`,
                method: `POST`,
                headers: {
                    'content-type': 'application/json',
                    Authorization: `auth ${key}`,
                },
                body: JSON.stringify(members),
            }

            request(options, (error, response, body) => {
                if (error) return reject(error)

                const res = JSON.parse(response.toJSON().body)

                if (res.status >= 400) return reject({ name: `mailchimpError`, message: res })

                return resolve(res)
            })
        })
    },
}
