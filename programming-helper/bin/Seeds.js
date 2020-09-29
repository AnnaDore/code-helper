const mongoose = require("mongoose");
const Tag = require("../models/Tag");
const Snippet = require("../models/Snippet");
const Extension = require('../models/Extension')
/* 
const tagData = [
  {
    name: "FE",
  },
  {
    name: "BE"
  },
  {
    name: "JS"
  }, 
  {
    name: "HTML"
  }, 
  {
    name: "CSS"
  }
];

const extensionData = [
  {
    name: "HTML", 
    imageUrl: "images/html.jpg"
  },
  {
    name: "CSS", 
    imageUrl: "images/css.jpg"
  }, 
  {
    name: "JS",
    imageUrl: "js.jpg"
  }

] */

mongoose
  .connect("mongodb://localhost/programming-helper", { useNewUrlParser: true })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
    return Tag.insertMany(tagData)
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err);
  });


/* mongoose
.connect("mongodb://localhost/programming-helper", { useNewUrlParser: true })
.then((x) => {
  console.log(
    `Connected to Mongo! Database name: "${x.connections[0].name}"`
  );
  return Extension.insertMany(extensionData)
})
.catch((err) => {
  console.error("Error connecting to mongo", err);
}); */