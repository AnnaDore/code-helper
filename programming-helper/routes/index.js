const express = require("express");
const { render } = require("../app");
const router = express.Router();
const { get } = require("mongoose");
const Tag = require("../models/Tag");
const Snippet = require("../models/Snippet");
const Extension = require("../models/Extension");

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

router.get("/snippet/:id", (req, res, next) => {
  Snippet.findById(req.params.id)
    .then((data) => {
      console.log(data);
      res.render("snippets/oneSnippet", data);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/create", (req, res, next) => {
  res.render("snippets/create");
});

router.post("/create", (req, res, next) => {
  const { name, description, snippet } = req.body;
  console.log(req.body);
  console.log("62");
  Snippet.create({
    // _id: id,
    name: name,
    description: description,
    snippet: snippet,
  }).then(() => {
    console.log(req.params);
    console.log("71");
    Snippet.findById(req.params.id)
      .then((data) => {
        console.log(data);
        res.render("snippets/oneSnippet", {data});
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

/* 


router.post('/create', (req, res, next) => {
  const { name, description, snippet } = req.body
  const snippetCreate =   Snippet.create({
    name: name, 
    description: description,
    snippet: snippet,
  })
  const snippetFind = Snippet.find({name: name})

 snippetCreate
  .then(() => {
    Snippet.find({name: name})
    .then(() => {
      res.redirect('/snippet/:id')
    })
    .catch(err => {
      console.log(err)
    })
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
  Snippet.findByIdAndUpdate({_id: req.params.id}, {$set: { name, description, snippet, tags}}, {new : true})
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
 */
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
