const User = require('../../models/User')
const authUser = require('../../middlewares/auth')

module.exports = {
    async view(req, res) {
        try {
            return res.render('index', {
                pageTitle: `Bratva`,
            })
        } catch (error) {
            console.log(error)
            return res.redirect('/login')
        }
    },
}
