const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    providerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Provider', 
        required: true 

    },
    name: { 
        type: String, 
        required: true 

    },
    description: { 
        type: String 

    },
    price: { 
        type: Number, 
        required: true 

    },
    color: { 
        type: String, 
        default: '#3b82f6' 

    } 
}, { timestamps: true })
module.exports = mongoose.model('Service', serviceSchema)