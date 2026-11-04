const mongoose = require('mongoose')

const providerSchema = new mongoose.Schema({

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
        unique: true
    },
    id: {
        type: String,
        required: true,
        maxlength: 9,
        minlength: 9
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String
    },
    service: {
        type: String,
        required: true
    },
    role: {
        type: [String],
        enum: ["Admin", "Provider"],
        default: ["Provider"],
        required: true
    }
}, { timestamps: true });
module.exports =    mongoose.models.Provider || mongoose.model("Provider", providerSchema)