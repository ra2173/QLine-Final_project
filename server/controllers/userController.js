const bcrypt = require('bcrypt')
const User = require("../models/User")
const Appointment = require('../models/Appointment')

const createNewUser = async (req, res) => {
    try {
        const { name, lastName, username, idNumber, email, password, phone } = req.body
        if (!name || !lastName || !username || !idNumber || !email || !password)
            return res.status(400).json({ message: 'all fields are required' })

        const currentUser = req.user
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ name, lastName, username, idNumber, email, password: hashedPassword, phone })
        if (user)
            return res.status(201).json({ message: 'new user created' })
        else
            return res.status(400).json({ message: 'Invalid task' })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Server error' })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const currentUser = req.user
        const users = await User.find().select('-password').lean()
        return res.status(200).json(users)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Server error' })
    }
}

const updateUser = async (req, res) => {
    try {
        const { _id, name, lastName, username, idNumber, email, password, phone } = req.body
        const currentUser = req.user
        if (!name || !lastName || !username || !idNumber || !email || !password)
            return res.status(400).json({ message: 'All fields are required' })

        const isAdmin = currentUser.role?.includes('Admin')
        const isProvider = currentUser.type === 'Provider' && !isAdmin

        if (currentUser.type === 'User' && currentUser._id !== _id)
            return res.status(403).json({ message: 'Forbidden' })

        const userId = currentUser.type === 'User' ? currentUser._id : _id
        if (isProvider && !_id)
            return res.status(400).json({ message: 'User id is required' })

        const user = await User.findById(userId).exec()
        if (!user)
            return res.status(400).json({ message: 'User not found' })
        user.name = name
        user.lastName = lastName
        user.username = username
        user.idNumber = idNumber
        user.email = email
        user.password = await bcrypt.hash(password, 10)
        user.phone = phone
        const updatedUser = await user.save()
        res.json(`'${updatedUser.username}' updated`)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Server error' })
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.body

        const currentUser = req.user
        const user = await User.findById(id).exec()
        if (!user)
            return res.status(400).json({ message: 'User not found' })
        await user.deleteOne()
        const reply = `User '${user.username}' ID ${user._id} deleted`
        res.json(reply)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Server error' })
    }
}

const getUserById = async (req, res) => {
    try {
        const { id } = req.params

        // חיפוש המשתמשת
        const user = await User.findById(id).select('-password')

        if (!user) {
            return res.status(404).json({
                message: 'המשתמשת לא נמצאה'
            })
        }

        const now = new Date()

        // מציאת הביקור האחרון שהסתיים
        const lastAppointment = await Appointment.findOne({
            participants: user._id,
            status: 'completed',
            startTime: { $lte: now }
        })
            .sort({ startTime: -1 })
            .select('startTime')

        // מציאת הביקור העתידי הקרוב
        const nextAppointment = await Appointment.findOne({
            participants: user._id,
            status: { $in: ['empty', 'booked', 'full'] },
            startTime: { $gt: now }
        })
            .sort({ startTime: 1 })
            .select('startTime')

        // הוספת תאריכי הביקורים לפרטי המשתמשת
        const userDetails = {
            ...user.toObject(),
            lastVisit: lastAppointment?.startTime || null,
            nextVisit: nextAppointment?.startTime || null
        }

        res.status(200).json(userDetails)

    } catch (error) {
        res.status(500).json({
            message: 'שגיאה בטעינת פרטי המשתמשת',
            error: error.message
        })
    }
}

const getProviderClients = async (req, res) => {
    try {
        const providerId = req.user._id

        const clientIds = await Appointment.distinct('clientId', {
            providerId,
            clientId: { $ne: null }
        })

        const clients = await User.find({ _id: { $in: clientIds } }).select('-password').lean()
        return res.json(clients)
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: 'Server error'
        })
    }
}
module.exports = {
    getAllUsers,
    createNewUser,
    getUserById,
    updateUser,
    deleteUser,
    getProviderClients
}