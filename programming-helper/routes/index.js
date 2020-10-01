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
  res.render("index");
});

function escapeRegex(text) {
  return text.replace(/[~[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

router.get("/all", (req, res, next) => {
  console.log(req.query.search);
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    Snippet.find({ name: regex })
      .then((data) => {
        console.log(data);
        res.render("snippets/all", { data });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    Snippet.find()
      .then((data) => {
        // console.log(data)

        res.render("snippets/all", { data });
      })
      .catch((err) => {
        console.log(err);
      });
  }
});


router.get('/snippet/:id', (req, res, next) => {
  const oneSnippet = Snippet.findById(req.params.id).populate("connections")
  const otherSnippets = Snippet.find()
  Promise.all([oneSnippet, otherSnippets])
  .then(data => {
    console.log(data[1][0].name)
    console.log(data[1])
    res.render('snippets/oneSnippet', {oneSnippet: data[0], otherSnippets: data[1]})
    
  })
  .catch(err => {
    console.log(err)
  })
})

router.post('/snippet/:id', (req, res, next) => {
  const { connections } = req.body;
  Snippet.findByIdAndUpdate({_id: req.params.id}, {$set: {connections}}, {new: true})
  .then(data => {
    console.log(data)
    res.redirect('/snippet/' + req.params.id)
  })
  .catch(err => {
    console.log(err)
  })
})

router.get("/create", checkLogin, (req, res, next) => {
  console.log(req.session.currentUser, "userCreateGet")
  const tag = Snippet.schema.path('tag').enumValues
  const extension = Snippet.schema.path('extension').enumValues
  Promise.all([extension, tag])
  .then(data => {
     console.log(data)
    res.render("snippets/create", {extension: data[0], tag: data[1]}); 
  })
});

router.post("/create",  async (req, res, next) => {
  const { name, description, snippet, extension, tag } = req.body;
  //console.log(req.body);
  console.log(req.session.currentUser, "user")
  let imageUrl;
  if (extension === "HTML") {
    imageUrl = "/images/html.jpg"
  } else if (extension === 'CSS') {
    imageUrl = '/images/css.jpg'
  } else {
    imageUrl = '/images/js.jpg'
  }
  try {
    const snippetVar =  await Snippet.create({
      name: name,
      description: description,
      snippet: snippet,
      extension: extension, 
      tag: tag, 
      imageUrl: imageUrl,
      creator: req.session.currentUser._id
    })

    console.log(snippetVar, "snippetVar")
    await User.findByIdAndUpdate({_id: req.session.currentUser._id}, {$set: {snippets: snippetVar._id}})
     res.redirect(`/snippet/${snippetVar._id}`);  
  }
  catch(e) {
    console.log(e)
  }

});


router.get('/snippet/edit/:id', checkLogin, (req, res, next) => {
  
  const tag = Snippet.schema.path('tag').enumValues
  const extension = Snippet.schema.path('extension').enumValues
  const snippet =  Snippet.findById(req.params.id)
  Promise.all([snippet, extension, tag])
  .then(data => {
    console.log(data)-
    res.render('snippets/edit', {snippet: data[0], extension: data[1], tag: data[2]})
  })
  .catch(err => {
    console.log(err)
  })
})

router.post('/snippet/:id', (req, res, next) => {
  console.log("82")
  const { name, description, snippet } = req.body
  console.log(req.body)
  
  Snippet.findByIdAndUpdate({_id: req.params.id}, {$set: { name, description, snippet}}, {new : true})
  .then(data => {
    res.redirect('/snippet/' + req.params.id)
    //res.render('snippets/oneSnippet', data)
  })
  .catch(err => {
    console.log(err)
  })
})

router.get('/delete/:id', checkLogin, (req, res, next) => {
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
module.exports = router;
