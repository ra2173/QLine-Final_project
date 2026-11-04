const Service = require("../models/Service")

const createNewService = async (req, res) => {
    try {
        const currentUser = req.user
        const { providerId, name, description, price, color } = req.body
        if (currentUser.type !== 'Provider')
            return res.status(403).json({ message: 'Forbidden' })

        if (!name || price === undefined)
            return res.status(400).json({ message: 'all required fields must be provided' })

        const serviceProviderId = currentUser.role?.includes('Admin') ? providerId : currentUser._id
        if (!serviceProviderId)
            return res.status(400).json({ message: 'providerId is required' })

        const service = await Service.create({ providerId: serviceProviderId, name, description, price, color })
        res.status(201).json({ message: 'new service created', service })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}

const getAllServices = async (req, res) => {
    try {
        const services = await Service.find().populate("providerId", "name lastName").lean()
        res.json(services)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}

const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id).lean()
        if (!service)
            return res.status(404).json({ message: 'Service not found' })
        res.json(service)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}

const updateService = async (req, res) => {
    try {
        const { _id, providerId, name, description, price, color } = req.body
        const currentUser = req.user

        if (currentUser.type !== 'Provider')
            return res.status(403).json({ message: 'Forbidden' })

        const isAdmin = currentUser.role?.includes('Admin')

        if (!_id || !name || price === undefined)
            return res.status(400).json({ message: 'all required fields must be provided' })

        if (isAdmin && !providerId)
            return res.status(400).json({ message: 'providerId is required' })

        const service = await Service.findById(_id).exec()
        if (!service)
            return res.status(404).json({ message: 'Service not found' })

        if (!isAdmin && service.providerId.toString() !== currentUser._id.toString())
            return res.status(403).json({ message: 'Forbidden' })

        service.name = name
        service.description = description
        service.price = price
        service.color = color

        if (isAdmin)
            service.providerId = providerId

        const updatedService = await service.save()
        res.json({ message: 'service updated', service: updatedService })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}

const deleteService = async (req, res) => {
    try {
        const { id } = req.body
        const currentUser = req.user

        if (currentUser.type !== 'Provider')
            return res.status(403).json({ message: 'Forbidden' })

        if (!id)
            return res.status(400).json({ message: 'id is required' })
        const service = await Service.findById(id).exec()
        if (!service)
            return res.status(404).json({ message: 'Service not found' })

        if (!currentUser.role?.includes('Admin') && service.providerId.toString() !== currentUser._id.toString())
            return res.status(403).json({ message: 'Forbidden' })
        await service.deleteOne()
        res.json({ message: 'service deleted' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}

const getMyServices = async (req, res) => {
    try {
        const currentUser = req.user

        if (currentUser.type !== 'Provider')
            return res.status(403).json({ message: 'Forbidden' })

        const isAdmin = currentUser.role?.includes('Admin')

        const filter = isAdmin
            ? {}
            : { providerId: currentUser._id }

        const services = await Service.find(filter).lean()

        return res.json(services)

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Server error' })
    }
}

module.exports = { getAllServices, createNewService, getServiceById, updateService, deleteService, getMyServices }
