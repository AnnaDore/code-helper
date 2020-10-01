const { Router } = require('express');
const router = new Router();
const mongoose = require('mongoose')

const bcrypt = require('bcrypt');
const User = require('../models/User');
const saltRounds = 10
 
router.get('/signup', (req, res, next) => {
    res.render('auth/signup')
})
 
router.post('/signup', (req, res, next) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        res.render('auth/signup', {errorMessage: "All fields are mandatory" })
        return
    }
    if (password.length < 8) {
        res.render('auth/signup', {errorMessage: 'Password has to have at least 8 characters'})
    }
    if (username.length < 3) {
        res.render('auth/signup', {errorMessage: 'Username has to be at least 3 characters'})
    }
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    if (!regex.test(password)) {
        res
        .status(500)
        .render('auth/signup', { errorMessage: 'Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.' })
        return
    }

    bcrypt
    .genSalt(saltRounds)
    .then(salt => bcrypt.hash(password, salt))
    .then(hashedPassword => {
        return User.create({
            username, 
            email,
            passwordHash: hashedPassword
        })
    })
    .then(userFromDB => {
        console.log(`New user is: ${userFromDB}`)
        res.render('users/user-profile', {userFromDB});
    })
    .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(500).render('auth/signup', { errorMessage: error.message });
        } else if (error.code === 11000) {
            res.status(500).render('auth/signup', {
               errorMessage: 'Username and email need to be unique. Either username or email is already used.'
            });
        } else {
            next(error);
        }
    })
})

router.get('/userProfile', (req, res) => {
    res.redirect('/userProfile')
});
 
module.exports = router;