const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TagSchema = new Schema(
    {
        name: {
            type: String,
            unique: true, 
            minlength: 1, 
            required: true
        }
    }
)

module.exports = Tag