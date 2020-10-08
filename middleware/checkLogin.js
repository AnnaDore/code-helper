const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose')

const checkLogin = (req, res, next) => {
    console.log(req.session.currentUser, "user chom checkLogin")
    if (req.session.currentUser) {
        next()
    } else {
        res.redirect('/signup')
    }
}

module.exports = checkLogin