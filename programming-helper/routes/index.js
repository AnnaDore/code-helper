const express = require("express");
const { render } = require("../app");
const router = express.Router();
const { get } = require("mongoose");

const Snippet = require("../models/Snippet");

const checkLogin = require('../middleware/checkLogin')
const session = require('../configs/session.config')
const User = require('../models/User')
const mongoose = require('mongoose')

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", { userInSession: req.session.currentUser});
});

function escapeRegex(text) {
  return text.replace(/[~[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

router.get("/all", (req, res, next) => {
 
  if (req.query.search) {
    console.log(req.query.search)
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    Snippet.find({ name: regex })
      .then((data) => {
        if(data.length === 0) {
          console.log('empty')
          console.log(data)
          res.render('snippets/empty-search', {data: data,  userInSession: req.session.currentUser} )
        } else {
          console.log('not empty')
          
          res.render("snippets/all", { data: data,  userInSession: req.session.currentUser });
        }


        
        //res.render("snippets/all", { data });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    Snippet.find()
      .then((data) => {

    console.log('true btn')
          res.render("snippets/all", { data: data,  userInSession: req.session.currentUser }); 
        


        //res.render("snippets/all", { data: data,  userInSession: req.session.currentUser });
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

//detailed link
router.get('/snippet/:id', (req, res, next) => {
  const oneSnippet = Snippet.findById(req.params.id).populate("connections")
  
  const otherSnippets = Snippet.find()
  Promise.all([oneSnippet, otherSnippets])
  .then(data => {
    res.render('snippets/oneSnippet', {oneSnippet: data[0], otherSnippets: data[1], userInSession: req.session.currentUser})
  })
  .catch(err => {
    console.log(err)
  })
}) 

//not detailed link
router.get('/general/snippet/:id', (req, res, next) => {
  const oneSnippet = Snippet.findById(req.params.id).populate("connections")
  const otherSnippets = Snippet.find()
  Promise.all([oneSnippet, otherSnippets])
  .then(data => {
    res.render('snippets/oneSnippetGeneral', {oneSnippet: data[0], otherSnippets: data[1], userInSession: req.session.currentUser})
  })
  .catch(err => {
    console.log(err)
  })
}) 

router.post('/snippet/:id', checkLogin, (req, res, next) => {
  const { connections } = req.body;
  Snippet.findByIdAndUpdate({_id: req.params.id}, {$set: {connections}}, {new: true})
  .then(data => {
    res.redirect('/snippet/' + req.params.id)
  })
  .catch(err => {
    console.log(err)
  })
})




 router.get('/snippet/edit/:id', checkLogin, (req, res, next) => {
   const tag = Snippet.schema.path('tag').enumValues
  const extension = Snippet.schema.path('extension').enumValues
  const snippet =  Snippet.findById(req.params.id)
  Promise.all([snippet, extension, tag])
  .then(data => {
    res.render('snippets/edit', {snippet: data[0], extension: data[1], tag: data[2], userInSession: req.session.currentUser})
  })
  .catch(err => {
    console.log(err)
  })
})

router.post('/snippet/:id', (req, res, next) => {
  const { name, description, snippet } = req.body
  Snippet.findByIdAndUpdate({_id: req.params.id}, {$set: { name, description, snippet}}, {new : true})
  .then(() => {
    res.redirect('/snippet/' + req.params.id)
    //res.render('snippets/oneSnippet', data)
  })
  .catch(err => {
    console.log(err)
  })
}) 

router.get('/delete/:id', checkLogin, (req, res, next) => {
  Snippet.findByIdAndDelete({_id: req.params.id})
  .then(() => {
    res.redirect('/all')
  })
  .catch(err => {
    console.log(err)
  })
})
 

module.exports = router;

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

//try to populate snippet model

/* router.get('/populate-all', (req, res, next) => {
   const tags = Tag.find()
  const snippet = Snippet.find({name: "dodo"}).populate('tags')
  Promise.all([tags, snippet]) 
   .then(data => {
    console.log(data)
    res.render('test', {data})
  })
  .catch(err => {
    console.log(err)
  })
}) 
 */