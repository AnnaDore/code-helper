const mongoose = require("mongoose");
const Tag = require("../models/Tag");
const Snippet = require("../models/Snippet");

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
