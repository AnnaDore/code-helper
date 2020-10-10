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

router.get("/all", async (req, res, next) => {
  let pageNo = parseInt(req.query.pageNo);
  let size = 4;
  var query = {};
  let n;
  if (pageNo < 0 || pageNo === 0) {
    response = {
      error: true,
      message: "invalid page number, should start with 1",
    };
    return res.json(response);
  }
  query.skip = size * (pageNo - 1);
  query.limit = size;
  const amountOfSnippets = Snippet.countDocuments().then((count) => {
    countAllNum = Number(count);
    if (countAllNum % size === 0) {
      n = Math.floor(countAllNum / size);
    } else {
      n = Math.floor(countAllNum / size + 1);
    }
    return n;
  });
  const paginatedSnippets = Snippet.find({}, {}, query, n, function (
    err,
    data
  ) {
    if (err) {
      response = { error: true, message: "Error fetching data" };
    } else {
      response = { error: false, message: data };
    }
  });
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
     Snippet.find({ name: regex })
      .then((data) => {
        if (data.length === 0) {
          res.render("snippets/empty-search", {
            userInSession: req.session.currentUser,
          });
        } else {
          res.render("snippets/allNotPaginated", {
            data: data,
            userInSession: req.session.currentUser,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      }); 
  }    else {
    Promise.all([ amountOfSnippets, paginatedSnippets])
    .then((allData) => {
      const data = allData[1];
      res.render("snippets/all", {
        data,
        pagination: {
          page: pageNo, // The current page the user is on
          pageCount: n, // The total number of available pages
        },
        userInSession: req.session.currentUser,
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }
});

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
  console.log(typeof connections);
  console.log(connections)
  try {
    await Snippet.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { connections } },
      { new: true }
    );
    if (typeof connections === "string") {
      await Snippet.findByIdAndUpdate(
        {_id: connections}, 
        { $set: {connections:req.params.id }}, 
          {new: true}
      )
    } else {
      connections.forEach(async (id) => {
        await Snippet.findByIdAndUpdate(
          { _id: id },
          { $set: { connections: req.params.id } },
          { new: true }
        );
      });
    }
    res.redirect("/snippet/" + req.params.id);
  } catch (err) {
    console.log(err);
  }
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

router.post("/snippet/edit/:id", (req, res, next) => {
  const { name, description, snippet } = req.body;
  userInSession =  req.session.currentUser
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
      res.redirect("/user/" + req.session.currentUser._id);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/feedback", (req, res, next) => {
  let addr = "vliegende.vogel.dodo@gmail.com";
  res.render("feedback", {userInSession: req.session.currentUser, addr});
});

module.exports = router;


