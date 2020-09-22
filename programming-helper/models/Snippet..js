const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SnippetSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            minlength: 3,
        },
        description: {
            type: String
        },
        snippet: {
            type: String,
            required: true,
            unique: true
        },
        connections: [{type: Schema.Types.ObjectId, ref: 'Snippet'}],
        tags: [{type: Schema.Types.ObjectId, ref: "Tag"}]
    }
)

module.exports = Snippet