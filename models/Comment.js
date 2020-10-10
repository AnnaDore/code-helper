const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema(
  {
    usName: { type: String },
    text: {
      type: String
      /* required: true */
    }, 
    avatar: {type: String},
    snippet: { type: Schema.Types.ObjectId, ref: 'Snippet'  }
    
  }
 
)

const Comment = mongoose.model("Comment", commentSchema)

module.exports = Comment