const express = require('express');
const { render } = require('../app');
const router  = express.Router();
const { get } = require("mongoose");
const Tag = require('../models/Tag')
const Snippet = require('../models/Snippet')

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
    console.log(data)
  }).limit(10)
  console.log("data")
  }) */

  module.exports = router;