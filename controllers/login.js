const schemas = require('../models/schemas.js')
const bcrypt = require('bcrypt')
const { search } = require('../routes/index.js')

exports.getLogin = (req,res) => {
    res.render('login', {title: 'Login', loggedIn: false, error:null})
}

exports.getSignup = (req,res) => {
    res.render('new-acct', {title: 'New Account', loggedIn:false, error:null})
}

exports.getLogout = (req,res) => {
    req.session.destroy()
    res.redirect('/')
}

exports.postLogin = async (req,res) => {
    let email = req.body.emailInput
    let pwd = req.body.pwdInput
    let loginSuccess = false
    let session = req.session
    session.loggedIn = false

    let users = schemas.users
    let qry = {email:email}

    if(email !== '' && pwd !== ''){
        let usersResult = await users.findOne(qry)
        .then( async(data) => {
            if (data){
                let pwdResult= await bcrypt.compare(pwd, data.pwd)
                .then((isMatch) => {
                    if(isMatch){
                    session.loggedIn = true
                    loginSuccess = true
                    } 
                })
            }
        })
    }
    if(loginSuccess === true){
        res.redirect('/')
    }else {
        res.render('login', {title: 'Login', loggedIn:false, error: 'Invalid Login'})
    }
}
    exports.postSignup = async (req,res) => {
        let email = req.body.emailInput
        let pwd = req.body.pwdInput
        if(email !== '' && pwd !== ''){
            let users = schemas.users
            let qry = {email:email}

        let userSearch = await users.findOne(qry)
        .then(async(data)=> {
        // await bcrypt.hash(password, 10) // could probably work instead
            if(!data){
                let saltRounds = 10
                let pwdSalt = await bcrypt.genSalt(saltRounds, async(err, salt) => {
                    let pwdHash = await bcrypt.hash(pwd, salt, async(err, hash) => {
                        let acct = {email:email, pwd:hash, level:'admin'}
                        let newUser = new schemas.users(acct)
                        let saveUser = await newUser.save()
                    });
                });
            }
        });
        res.render('login', {title:'Login', loggedIn:false, error: 'Please login with your new account'});
} else{
    res.render('new-acct', {title: 'New Account', loggedIn:false, error:'All fields are required. Please check and try again.'});
}

};