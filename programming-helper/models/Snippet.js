const mongoose = require('mongoose')
const Schema = mongoose.Schema

const snippetSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: [true, "Name was used already"],
            minlength: 3, 
        },
        description: {
            type: String
        },
        snippet: {
            type: String,
            required: true,
            unique: [true, 'Snippet like this was already created'] 
        },
        connections: [{type: Schema.Types.ObjectId, ref: 'Snippet'}],
   
        tag: {
            type: String, 
            enum: [
                "FrontEnd", 
                "BackEnd"
            ]
        },
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
       }, 
       creator: {
           type: Schema.Types.ObjectId, ref: 'User'
       }
    }
)

const Snippet = mongoose.model("Snippet", snippetSchema)

module.exports = Snippet

