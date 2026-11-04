const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    idNumber: {
        type: String,
        required: true,
        unique: true,
        minlength: 9,
        maxlength: 9
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema);