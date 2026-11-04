const mongoose = require('mongoose')

const waitlistSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Provider',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    }
}, { timestamps: true })
waitlistSchema.index(
    { clientId: 1, appointmentId: 1 },
    { unique: true }
)
module.exports = mongoose.model('Waitlist', waitlistSchema)