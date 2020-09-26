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
        tags: [{ type: String} ]
        //tags: [{type: Schema.Types.ObjectId, ref: "Tag"}]
    }
)

const Snippet = mongoose.model("Snippet", snippetSchema)

module.exports = Snippet

