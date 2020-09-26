const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tagSchema = new Schema(
    {
        name: {
            type: String,
            unique: true, 
            minlength: 1, 
            required: true
        }
    }
)

const Tag = mongoose.model("Tag", tagSchema)

module.exports = Tag