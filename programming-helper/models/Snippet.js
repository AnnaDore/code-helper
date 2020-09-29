const mongoose = require('mongoose')
const Schema = mongoose.Schema

const snippetSchema = new Schema(
    {
      
        name: {
            type: String,
            required: true,
           /*  unique: true,
            minlength: 3, */
        },
        description: {
            type: String
        },
        snippet: {
            type: String,
            required: true,
           /*  unique: true */
        },
        connections: [{type: Schema.Types.ObjectId, ref: 'Snippet'}],
      // tags: [{type: Schema.Types.ObjectId, ref: 'Tag'}],
        tag: {
            type: String, 
            enum: [
                "FrontEnd", 
                "BackEnd"
            ]
        },
       // extension: {type: Schema.Types.ObjectId, ref: 'Extension'}
       extension: {
           type: String, 
           enum: [
               "HTML", 
               "CSS", 
               "JS"
           ]
       }, 
       imageUrl: {
           type: String
       }
    }
)

const Snippet = mongoose.model("Snippet", snippetSchema)

module.exports = Snippet

