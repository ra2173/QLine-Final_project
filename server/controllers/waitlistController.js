const Waitlist = require("../models/Waitlist")
const Appointment = require("../models/Appointment")

const createNewWaitlistEntry = async (req, res) => {
    try {
        const currentUser = req.user
        const { clientId, providerId, date, appointmentId } = req.body

        if (currentUser.type !== 'User' && !currentUser.role?.includes('Admin'))
            return res.status(403).json({ message: 'Forbidden' })

        if (!providerId || !date || !appointmentId)
            return res.status(400).json({ message: 'all required fields must be provided' })

        const waitlistClientId = currentUser.type === 'User' ? currentUser._id : clientId
        if (!waitlistClientId)
            return res.status(400).json({ message: 'clientId is required' })

        const existingEntry = await Waitlist.findOne({
            clientId: waitlistClientId,
            appointmentId
        })

        if (existingEntry)
            return res.status(400).json({
                message: 'You are already on the waitlist for this appointment'
            })

        const appointment = await Appointment.findById(appointmentId)
        if (!appointment)
            return res.status(404).json({ message: 'Appointment not found' })

        if (appointment.participants.length < appointment.maxParticipants)
            return res.status(400).json({
                message: 'This appointment is not full yet'
            })
            
        const waitlistEntry = await Waitlist.create({ clientId: waitlistClientId, providerId, date, appointmentId })
        res.status(201).json({ message: 'new waitlist entry created', waitlistEntry })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}

const getAllWaitlistEntries = async (req, res) => {
    try {
        if (!req.user.role?.includes('Admin'))
            return res.status(403).json({ message: 'Forbidden' })
        const waitlistEntries = await Waitlist.find().lean()
        if (!waitlistEntries.length)
            return res.status(404).json({ message: 'No waitlist entries found' })
        res.json(waitlistEntries)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}

const getWaitlistEntryById = async (req, res) => {
    try {
        const currentUser = req.user
        const waitlistEntry = await Waitlist.findById(req.params.id).lean()
        if (!waitlistEntry)
            return res.status(404).json({ message: 'Waitlist entry not found' })
        const isAdmin = currentUser.role?.includes('Admin')
        const isClient = currentUser.type === 'User' &&
            waitlistEntry.clientId.toString() === currentUser._id
        const isProvider = currentUser.type === 'Provider' &&
            waitlistEntry.providerId.toString() === currentUser._id

        if (!isAdmin && !isClient && !isProvider)
            return res.status(403).json({ message: 'Forbidden' })

        res.json(waitlistEntry)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}

const updateWaitlistEntry = async (req, res) => {
    try {
        const currentUser = req.user
        const { _id, clientId, providerId, date, appointmentId } = req.body

        if (!_id || !date || !appointmentId)
            return res.status(400).json({ message: 'all required fields must be provided' })

        const waitlistEntry = await Waitlist.findById(_id).exec()
        if (!waitlistEntry)
            return res.status(404).json({ message: 'Waitlist entry not found' })

        const isAdmin = currentUser.role?.includes('Admin')
        const isProvider = currentUser.type === 'Provider' &&
            waitlistEntry.providerId.toString() === currentUser._id

        if (!isAdmin && !isProvider)
            return res.status(403).json({ message: 'Forbidden' })

        waitlistEntry.date = date
        waitlistEntry.appointmentId = appointmentId
        if (isAdmin) {
            if (!clientId || !providerId)
                return res.status(400).json({ message: 'clientId and providerId are required' })

            waitlistEntry.clientId = clientId
            waitlistEntry.providerId = providerId
        }
        const updatedWaitlistEntry = await waitlistEntry.save()
        res.json({ message: 'waitlist entry updated', waitlistEntry: updatedWaitlistEntry })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}

const deleteWaitlistEntry = async (req, res) => {
    try {
        const currentUser = req.user
        const { id } = req.body
        if (!id)
            return res.status(400).json({ message: 'id is required' })
        const waitlistEntry = await Waitlist.findById(id).exec()
        if (!waitlistEntry)
            return res.status(404).json({ message: 'Waitlist entry not found' })
        const isAdmin = currentUser.role?.includes('Admin')
        const isClient = currentUser.type === 'User' &&
            waitlistEntry.clientId.toString() === currentUser._id
        const isProvider = currentUser.type === 'Provider' &&
            waitlistEntry.providerId.toString() === currentUser._id

        if (!isAdmin && !isClient && !isProvider)
            return res.status(403).json({ message: 'Forbidden' })

        await waitlistEntry.deleteOne()
        res.json({ message: 'waitlist entry deleted' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}

const getMyWaitlist = async (req, res) => {
    try {
        const currentUser = req.user

        // רק לקוחה יכולה לקבל את רשימת ההמתנה האישית שלה
        if (currentUser.type !== 'User')
            return res.status(403).json({ message: 'Forbidden' })

        const waitlistEntries = await Waitlist.find({
            clientId: currentUser._id
        })
            .populate('providerId', 'name lastName')
            .populate('appointmentId')
            .sort({ date: 1 })
            .lean()

        // מחזירים מערך ריק אם אין רשומות
        res.json(waitlistEntries)

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}
module.exports = {
    getAllWaitlistEntries,
    createNewWaitlistEntry,
    getWaitlistEntryById,
    updateWaitlistEntry,
    deleteWaitlistEntry,
    getMyWaitlist
}

