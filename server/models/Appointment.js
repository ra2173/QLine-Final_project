
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    // הלקוחות שנרשמו לשיעור הקבוצתי
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    // מספר המשתתפות המרבי
    maxParticipants: {
        type: Number,
        default: 10,
        min: 1,
        required: true
    },

    // המדריכה שמעבירה את השיעור
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Provider',
        required: true
    },

    // השירות או סוג השיעור
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },

    // מועד תחילת השיעור
    startTime: {
        type: Date,
        required: true
    },

    // משך השיעור בדקות
    lengthTime: {
        type: Number,
        required: true,
        min: 1
    },

    // מצב השיעור
    status: {
        type: String,
        enum: ['empty', 'full', 'booked', 'completed', 'late cancel'],
        default: 'empty',
        required: true
    },

    // הסניף שבו מתקיים השיעור
    branch: {
        type: String,
        required: true,
        trim: true
    },

    // הערות נוספות
    notes: {
        type: String,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
