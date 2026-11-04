const Provider = require("../models/provider")
const bcrypt = require('bcrypt')


const createNewProvider = async (req, res) => {
    try {
        const currentUser = req.user
        if (!currentUser.role?.includes('Admin'))
            return res.status(403).json({ message: 'Forbidden' })

        const { name, lastName, username, id, email, password, phone, service } = req.body
        if (!name || !lastName || !id || !email || !password || !service)
            return res.status(400).json({ message: 'all required fields must be provided' })

        const duplicate = await Provider.findOne({ $or: [{ username }, { id }, { email }] }).lean()
        if (duplicate)
            return res.status(409).json({ message: 'Username, ID or email already exists' })

        const hashedPassword = await bcrypt.hash(password, 10)
        const provider = await Provider.create({ name, lastName, username, id, email, password: hashedPassword, phone, service })
        res.status(201).json({ message: 'new provider created', id: provider._id })
    } catch (error) {
        if (error.code === 11000)
            return res.status(409).json({ message: 'Username, ID or email already exists' })
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }

}

const getAllProviders = async (req, res) => {
    try {
        const currentUser = req.user
        if (!currentUser.role?.includes('Admin'))
            return res.status(403).json({ message: 'Forbidden' })
        const providers = await Provider.find().select('-password').lean()
        if (!providers.length)
            return res.status(404).json({ message: 'No providers found' })
        res.json(providers)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' })
    }
}

const getProviderById = async (req, res) => {
    try {
        const currentUser = req.user
        const { id } = req.params
        if (!currentUser.role?.includes('Admin') && currentUser._id.toString() !== id)
            return res.status(403).json({ message: 'Forbidden' })

        const provider = await Provider.findById(req.params.id).select('-password').lean()
        if (!provider)
            return res.status(404).json({ message: 'Provider not found' })
        res.json(provider)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Server error' })
    }
}

const updateProvider = async (req, res) => {
    try {
        const {
            _id, name, lastName, username,
            id, email, password, phone, service
        } = req.body

        const currentUser = req.user

        if (currentUser.type !== 'Provider')
            return res.status(403).json({ message: 'Forbidden' })

        const isAdmin = currentUser.role?.includes('Admin')

        const providerId = isAdmin ? _id : currentUser._id

        if (!providerId)
            return res.status(400).json({ message: 'Provider ID is required' })

        const provider = await Provider.findById(providerId).exec()

        if (!provider)
            return res.status(404).json({ message: 'Provider not found' })

        // עדכון רק של שדות שנשלחו
        if (name !== undefined) provider.name = name
        if (lastName !== undefined) provider.lastName = lastName
        if (username !== undefined) provider.username = username
        if (id !== undefined) provider.id = id
        if (email !== undefined) provider.email = email
        if (phone !== undefined) provider.phone = phone
        if (service !== undefined) provider.service = service

        // סיסמה מעדכנים רק אם נשלחה
        if (password) {
            provider.password = await bcrypt.hash(password, 10)
        }

        const updatedProvider = await provider.save()

        res.json({
            message: 'provider updated',
            provider: {
                _id: updatedProvider._id,
                name: updatedProvider.name,
                lastName: updatedProvider.lastName,
                username: updatedProvider.username,
                id: updatedProvider.id,
                email: updatedProvider.email,
                phone: updatedProvider.phone,
                service: updatedProvider.service
            }
        })

    } catch (error) {
        console.error(error)

        if (error.code === 11000)
            return res.status(409).json({ message: 'Username, ID or email already exists' })

        return res.status(500).json({ message: 'Server error' })
    }
}

const deleteProvider = async (req, res) => {
    try {
        const currentUser = req.user
        if (!currentUser.role?.includes('Admin'))
            return res.status(403).json({ message: 'Forbidden' })

        const id = req.params.id || req.body.id

        if (!id)
            return res.status(400).json({ message: 'id is required' })
        const provider = await Provider.findById(id).exec()
        if (!provider)
            return res.status(404).json({ message: 'Provider not found' })

        await provider.deleteOne()
        res.json({ message: 'provider deleted' })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Server error' })
    }
}

module.exports = { getAllProviders, createNewProvider, getProviderById, updateProvider, deleteProvider }
