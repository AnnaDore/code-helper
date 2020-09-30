const { Router } = require('express');
const router = new Router();

const bcrypt = require('bcrypt');
const User = require('../models/User');
const saltRounds = 10
 
router.get('/signup', (req, res, next) => {
    res.render('auth/signup')
})
 
router.post('/signup', (req, res, next) => {
    const { username, email, password } = req.body

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
    .catch(err => {
        console.log(err)
    })
})

router.get('/userProfile', (req, res) => {
    res.redirect('/userProfile')
});
 
module.exports = router;