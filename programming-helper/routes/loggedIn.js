const express = require("express");
const { render } = require("../app");
const router = express.Router();
const { get } = require("mongoose");
const Snippet = require("../models/Snippet");
const checkLogin = require("../middleware/checkLogin");
const session = require("../configs/session.config");
const User = require("../models/User");
const mongoose = require("mongoose");
const uploadCloud = require("../configs/cloudinary");

//router.get("/create",  checkLogin, (req, res, next) => {
router.get(`/:id/create`,   (req, res, next) => {
  console.log(req.session.currentUser, "userCreateGet");
  const tag = Snippet.schema.path("tag").enumValues;
  const extension = Snippet.schema.path("extension").enumValues;
  Promise.all([extension, tag])
  .then((data) => {
    res.render("snippets/create", {
      extension: data[0],
      tag: data[1],
      userInSession: req.session.currentUser,
    });
  });
});

router.post("/:id/create", async (req, res, next) => {

  const { name, description, snippet, extension, tag } = req.body;
  console.log(req.session.currentUser, "user");
  let imageUrl;
  if (extension === "HTML") {
    imageUrl = "/images/html.jpg";
  } else if (extension === "CSS") {
    imageUrl = "/images/css.jpg";
  } else {
    imageUrl = "/images/js.jpg";
  }

  try {

    const snippetName = await Snippet.findOne({name})
    if (snippetName) {
      res.render('snippets/create', {errorMessage: "The name exists", userInSession: req.session.currentUser})
      return
    }
    const snippetCode = await Snippet.findOne({snippet})
    if (snippetCode) {
      res.render('snippets/create', {errorMessage: "The snippet exists", userInSession: req.session.currentUser})
      return
    }
    if (!name.length || !snippet.length) {
      res.render('snippets/create',  {errorMessage: "Name or snippet cant be empty", userInSession: req.session.currentUser})
      return
    }
    const snippetVar = await Snippet.create({
      name: name,
      description: description,
      snippet: snippet,
      extension: extension,
      tag: tag,
      imageUrl: imageUrl,
      creator: req.session.currentUser._id,
    });
    console.log(snippetVar, "snippetVar");
    await User.findByIdAndUpdate(

      { _id: req.session.currentUser._id },
      { $push: { snippets: snippetVar._id } }
    );
    res.redirect(`/snippet/${snippetVar._id}`);
  } catch (errorMessage) {
    console.log(errorMessage);
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

router.post("/bio-update/:id", (req, res, next) => {
  const { bio } = req.body;
  req.session.currentUser.bio = bio;
  User.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: { bio: bio } },
    { new: true }
  )
    .then(() => {
      res.redirect(`/${req.params.id}`);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post(
  "/add-avatar/:id",
  uploadCloud.single("avatar"),
  (req, res, next) => {
    const { avatarPath } = req.body;
    req.session.currentUser.avatarPath = req.file.path;
    User.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { avatarPath: req.session.currentUser.avatarPath } },
      { new: true }
    )
      .then(() => {
        res.redirect(`/${req.params.id}`);
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

module.exports = router;
