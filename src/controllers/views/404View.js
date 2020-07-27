module.exports = {
    async view(req, res) {
        try {
            return res.render('404')
        } catch (error) {
            console.log(error)
            return res.redirect('/login')
        }
    },
}
