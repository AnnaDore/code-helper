const express = require('express');
const { render } = require('../app');
const router  = express.Router();
const { get } = require("mongoose");
const Tag = require('../models/Tag')
const Snippet = require('../models/Snippet')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.get('/all', (req, res, next) => {
  console.log("15")
  Snippet.find()
  .then(data => {
   // console.log(data)
    
    res.render("snippets/all", {data})
  })
  .catch(err => {
    console.log(err)
    
  })
 
})

router.get('/create', (req, res, next) => {
  Tag.find()
 // Snippet.find()
  .then(data => {
    console.log(data)
    res.render('snippets/create', {data})
  })
  .catch(err => {
    console.log(err)
  })
})

router.post('/create', (req, res, next) => {
  const { name, description, snippet/* , connections */, tags  } = req.body
  console.log(req.body)
  Snippet.create({
    name: name, 
    description: description,
    snippet: snippet,
    /* connections: connections, */
    tags: tags 
  })
  .then(() => {
    res.redirect('/all')
  })
  .catch(err => {
    console.log(err)
  })
})

router.get('/snippet/:id', (req, res, next) => {
  Snippet.findById(req.params.id)
  .then(data => {
    console.log(data)
    res.render('snippets/oneSnippet', {data})
  })
  .catch(err => {
    console.log(err)
  })
})

router.get('/snippet/:id/edit', (req, res, next) => {
  Snippet.findById(req.params.id)
  .then(data => {
    console.log(data)
    res.render('snippets/edit', {data})
  })
  .catch(err => {
    console.log(err)
  })
})

router.post('/snippet/:id', (req, res, next) => {
  console.log("82")
  Snippet.findByIdAndUpdate({_id: req.params.id}, {$set: {name, description, snippet, tags/* , connections  */}}, {new : true})
  .then(data => {
    console.log("85")
    console.log(data)
    res.render('snippets/oneSnippet', {data})
  })
  .catch(err => {
    console.log(err)
  })
})

module.exports = router;