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
     .then(user => {
        req.session.currentUser = user;
        console.log(`New user is: ${user}`)
        res.redirect(`/auth/user/${user._id}`);
         
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

/* router.get('/userProfile', (req, res) => {
    res.render('users/user-profile')
}); */

router.get('/login', (req, res) => {
    res.render('auth/login')
});

router.post('/login', (req, res, next) => {
    console.log('req.session is', req.session)
    const { email, password } = req.body

    if (email === '' || password === '') {
        res.render('auth/login', {
            errorMessage: 'Please put email and password'
        })
        return
    }
    
    User.findOne({ email })
    .then(user => {
        if (!user) {
            res.render('auth/login', {
                errorMessage: "Email is not registered"
            })
            return
        } else if (bcrypt.compareSync(password, user.passwordHash)) {
            req.session.currentUser = user;
            res.redirect(`/auth/user/${user._id}`);
        } else {
            res.render('auth/login',{  errorMessage: "Incorrect password" })
        }
    })
    .catch (err => {
        next(err)
    })
})

router.get(`/auth/user/:id`, (req, res) => {
    console.log(req.session.currentUser)
    res.render('users/userProfile', { userInSession: req.session.currentUser });
  });

router.post('/logout', (req, res, next) => {
    req.session.destroy()
    res.redirect('/')
})
 
module.exports = router