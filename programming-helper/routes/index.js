const express = require("express");
const { render } = require("../app");
const router = express.Router();
const { get } = require("mongoose");

const Snippet = require("../models/Snippet");

const checkLogin = require("../middleware/checkLogin");
const session = require("../configs/session.config");
const User = require("../models/User");
const mongoose = require("mongoose");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", { userInSession: req.session.currentUser });
});

function escapeRegex(text) {
  return text.replace(/[~[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

router.get("/all",  async (req, res, next) => {
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    Snippet.find({ name: regex })
      .then((data) => {
        if (data.length === 0) {
          res.render("snippets/empty-search", {
            data: data,
            userInSession: req.session.currentUser,
          });
        } else {
          res.render("snippets/all", {
            data: data,
            userInSession: req.session.currentUser,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
/*     const match = {};
    const sort = {};
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.skip);

    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(":");
        sort[parts[0]] = parts[1] === 'desc'? -1 : 1;
    }

    try {
        await req.user.populate('tasks').execPopulate({
            path: 'tasks',
            match,
            options: {
                sort,
                limit,
                skip
            }
        });
        
        const totalTasks = await Task.countDocuments({ owner: req.user._id }); 

        const pages = Array.from({ length: Math.ceil(totalTasks / limit) },(v, idx) => {
            return {
                num: idx + 1,
                limit,
                skip: (limit * (idx + 1)) - limit
            }
        });

        res.render('tasks', {
            tasks: req.user.tasks,
            enablePaging: totalTasks > limit,
            pages,
            limit
        });
    } catch (error) {
        res.status(500).send(error);
    } */
/*     var pageNo = parseInt(req.query.pageNo);
    var size = parseInt(req.query.size);
    var query = {};
    if (pageNo < 0 || pageNo === 0) {
      response = {
        error: true,
        message: "invalid page number, should start with 1",
      };
      return res.json(response);
    }
    query.skip = size * (pageNo - 1);
    query.limit = size;
    // Find some documents
    Snippet.find({}, {}, query, function (err, data) {
      // Mongo command to fetch all data from collection.
      if (err) {
        response = { error: true, message: "Error fetching data" };
      } else {
        response = { error: false, message: data };
      }
      res.render("snippets/all", {
        pagination: { page: 3, limit: 10, totalRows: 2 },
      });
    })
    .catch(err => {
      console.log(err)
    }) */
    Snippet.find()
      .then((data) => {
        res.render("snippets/all", {
          data: data,
          userInSession: req.session.currentUser,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

//pagination attempt
/* router.get("/snippets", (req, res) => {
  var pageNo = parseInt(req.query.pageNo);
  var size = parseInt(req.query.size);
  var query = {};
  if (pageNo < 0 || pageNo === 0) {
    response = {
      error: true,
      message: "invalid page number, should start with 1",
    };
    return res.json(response);
  }
  query.skip = size * (pageNo - 1);
  query.limit = size;
  // Find some documents
  Snippet.find({}, {}, query, function (err, data) {
    // Mongo command to fetch all data from collection.
    if (err) {
      response = { error: true, message: "Error fetching data" };
    } else {
      response = { error: false, message: data };
    }
    res.render("snippets/all", {
      pagination: { page: 3, limit: 10, totalRows: 2 },
    });
  });
}); */

//detailed link
router.get("/snippet/:id", (req, res, next) => {
  const oneSnippet = Snippet.findById(req.params.id).populate("connections");
  const otherSnippets = Snippet.find();
  Promise.all([oneSnippet, otherSnippets])
    .then((data) => {
      res.render("snippets/oneSnippet", {
        oneSnippet: data[0],
        otherSnippets: data[1],
        userInSession: req.session.currentUser,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

//not detailed link
router.get("/general/snippet/:id", (req, res, next) => {
  const oneSnippet = Snippet.findById(req.params.id).populate("connections");
  const otherSnippets = Snippet.find();
  Promise.all([oneSnippet, otherSnippets])
    .then((data) => {
      res.render("snippets/oneSnippetGeneral", {
        oneSnippet: data[0],
        otherSnippets: data[1],
        userInSession: req.session.currentUser,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/snippet/:id", async (req, res, next) => {
  const { connections } = req.body;
  console.log(connections)

    try {
      await Snippet.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { connections } },
        { new: true }
      )
      
      connections.forEach(async id => {
        await Snippet.findByIdAndUpdate(
          { _id: id },
          { $set: {connections:req.params.id} },
          { new: true }
        )
      })
      res.redirect("/snippet/" + req.params.id);
    } 
    catch(err){console.log(err)}
/*   const { connections } = req.body;
  Snippet.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: { connections } },
    { new: true }
  )
    .then((data) => {
      res.redirect("/snippet/" + req.params.id);
    })
    .catch((err) => {
      console.log(err);
    }); */
});

router.get("/snippet/edit/:id", checkLogin, (req, res, next) => {
  const tag = Snippet.schema.path("tag").enumValues;
  const extension = Snippet.schema.path("extension").enumValues;
  const snippet = Snippet.findById(req.params.id);
  Promise.all([snippet, extension, tag])
    .then((data) => {
      res.render("snippets/edit", {
        snippet: data[0],
        extension: data[1],
        tag: data[2],
        userInSession: req.session.currentUser,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/snippet/:id", (req, res, next) => {
  const { name, description, snippet } = req.body;
  Snippet.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: { name, description, snippet } },
    { new: true }
  )
    .then(() => {
      res.redirect("/snippet/" + req.params.id);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/delete/:id", checkLogin, (req, res, next) => {
  Snippet.findByIdAndDelete({ _id: req.params.id })
    .then(() => {
      res.redirect("/" + req.session.currentUser._id);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/feedback", (req, res, next) => {
  let first = "anna";
  let second = ".dorenskaya";
  let third = "@gmail.com";
  let addr = first + second + third;
  res.render("feedback");
});

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
