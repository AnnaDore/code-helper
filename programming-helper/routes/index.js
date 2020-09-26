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

function escapeRegex(text) {
  return text.replace(/[~[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
}

router.get('/all', (req, res, next) => {
  
  console.log(req.query.search)
  if(req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi')
    Snippet.find({name: regex})
    .then(data => {
      console.log(data)
      res.render('snippets/all', {data})
    })
    .catch(err => {
      console.log(err)
    })
  } else {
    Snippet.find()
    .then(data => {
     // console.log(data)
      
      res.render("snippets/all", {data})
    })
    .catch(err => {
      console.log(err)
      
    })
  }

 
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
  const { name, description, snippet, tags } = req.body
  console.log(req.body.name)
  Snippet.findByIdAndUpdate({_id: req.params.id}, {$set: { name, description, snippet, tags/* , connections  */}}, {new : true})
  .then(data => {
    console.log("85")
    console.log(data)
    res.render('snippets/oneSnippet', {data})
  })
  .catch(err => {
    console.log(err)
  })
})

router.get('/delete/:id', (req, res, next) => {
  console.log('97')
  Snippet.findByIdAndDelete({_id: req.params.id})
  .then(() => {
    console.log('99')
    res.redirect('/all')
  })
  .catch(err => {
    console.log(err)
  })
})

//search attempt
/* 
router.get('/search', (req, res, next) => {
  let q = req.query.q
//full search
  Snippet.find({
    $text: {
      $search: q
    }
  }, {
  _id: 0,
  __v: 0
  }, function(err, data) {
    res.json(data)
  }) 
//partial search
Snippet.find({
  name: {
    $regex: new RegExp(q)
  }
}, {
  _id: 0, 
  __v: 0
}, function(err, data) {
  res.json(data)
}).limit(10)

})*/

module.exports = router;