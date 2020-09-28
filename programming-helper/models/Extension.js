const mongoose = require('mongoose')
const Schema = mongoose.Schema

const extensionSchema = new Schema (
    {
      //  _id: mongoose.Schema.Types.ObjectId, 
        name: {
            type: String,
            /* required: true */
        }, 
        imageUrl: {
            type: String,
            /* required: true */
        }
    }
)

const Extension = mongoose.model('Extension', extensionSchema)

module.exports = Extension