const schemas = require('../models/schemas.js')


module.exports = {
    getHome: async (req, res) => {
        let menu = schemas.menu
        let session = req.session
        let menuResult = await menu.find({})
        .then( (menuData)  => {
            res.render('index', {title: 'Menu Tracker', data: menuData, search: '', loggedIn: session.loggedIn} )
        })
    },
    getSearch: async(req,res) => {
        let menu = schemas.menu
        let session = req.session
        let q = req.body.seearchInput
        let menuData = null
        let qry = {name:{$regex: '^' + q, $options: 'i'}} 

        if(q != null){
            let menuResult = await menu.find(qry)
            .then((data) => {
                menuData = data
            })
        } else{
            q = 'search'
            let menuResult = await menu.find({})
            .then((data) => {
                menuData = data
            })
        }
        res.render('index', {title: 'Menu Tracker', data: menuData, search: q, loggedIn: session.loggedIn})
    }
}