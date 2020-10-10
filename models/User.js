const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema(
    {
        username: {
            type: String, 
            required: [true, 'Username is required.'],
            unique: [true, 'This username exists already'], 
            trim: true,
            minlength: 3
        }, 
        email: {
            type: String,       
            required: [true, "Email is required"], 
            unique: true, 
            lowercase: true, 
            trim: true, 
            match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Please use a valid email']
        }, 
        passwordHash: {
            type: String, 
            requred: [true, "Password is required"]
        }, 
        snippets: [{type: Schema.Types.ObjectId, ref: 'Snippet' }], 
        bio: {
            type: String
        }, 
        avatarPath: {
            type: String
        }
    }, 
    {
        timestamp: true
    }
)

const User = mongoose.model("User", userSchema)

module.exports = User