const Appointment = require("../models/Appointment")

const createNewAppointment = async (req, res) => {
  try {
    const currentUser = req.user
    const {
      providerId,
      serviceId,
      startTime,
      lengthTime,
      branch,
      notes,
      maxParticipants
    } = req.body

    const isAdmin = currentUser.type === 'Provider' && currentUser.role?.includes('Admin')
    const isProvider = currentUser.type === 'Provider' && !isAdmin

    if (!isProvider && !isAdmin)
      return res.status(403).json({ message: 'Forbidden' })

    if (!serviceId || !startTime || lengthTime === undefined || !branch)
      return res.status(400).json({ message: 'all required fields must be provided' })

    if (!Number.isInteger(maxParticipants) || maxParticipants < 1)
      return res.status(400).json({ message: 'Invalid maxParticipants' })

    const appointmentProviderId = isProvider ? currentUser._id : providerId

    if (!appointmentProviderId)
      return res.status(400).json({ message: 'providerId is required' })

    const appointment = await Appointment.create({
      participants: [],
      maxParticipants,
      providerId: appointmentProviderId,
      serviceId,
      startTime,
      lengthTime,
      status: 'empty',
      branch,
      notes
    })
    return res.status(201).json({ message: 'class created', appointment })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('providerId', 'name lastName')
      .populate('serviceId')
      .sort({ startTime: 1 })
      .lean()

    const result = appointments.map(appointment => ({
      ...appointment,
      participants: appointment.participants?.length || 0
    }))

    return res.json(result)

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).select('-participants -clientId').populate('providerId', 'name lastName').populate('serviceId').lean()

    if (!appointment)
      return res.status(404).json({ message: 'Appointment not found' })
    const participantsCount = await Appointment.aggregate([
      { $match: { _id: appointment._id } },
      {
        $project: {
          participantsCount: { $size: '$participants' }
        }
      }
    ])

    appointment.participantsCount =
      participantsCount[0]?.participantsCount || 0
    appointment.isRegistered = await Appointment.exists({
      _id: appointment._id,
      participants: req.user._id
    })
    return res.json(appointment)

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

const getAppointmentParticipants = async (req, res) => {
  try {
    const currentUser = req.user
    const { id } = req.params
    const isAdmin = currentUser.type === 'Provider' && currentUser.role?.includes('Admin')
    const isProvider = currentUser.type === 'Provider' && !isAdmin
    if (!isProvider && !isAdmin)
      return res.status(403).json({ message: 'Forbidden' })
    const appointment = await Appointment.findById(id).populate('participants', 'name lastName phone').lean()
    if (!appointment)
      return res.status(404).json({ message: 'Appointment not found' })
    if (isProvider && appointment.providerId.toString() !== currentUser._id)
      return res.status(403).json({ message: 'Forbidden' })
    return res.json(appointment.participants)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

const updateAppointment = async (req, res) => {
  try {
    const currentUser = req.user

    const {
      _id,
      clientId,
      providerId,
      serviceId,
      startTime,
      lengthTime,
      status,
      branch,
      notes,
      maxParticipants
    } = req.body

    if (!_id || !serviceId || !startTime || lengthTime === undefined || !branch)
      return res.status(400).json({ message: 'all required fields must be provided' })

    const appointment = await Appointment.findById(_id).exec()

    if (!appointment)
      return res.status(404).json({ message: 'Appointment not found' })

    const isAdmin = currentUser.type === 'Provider' && currentUser.role?.includes('Admin')
    const isProvider = currentUser.type === 'Provider' && !isAdmin && appointment.providerId.toString() === currentUser._id

    if (!isAdmin && !isProvider)
      return res.status(403).json({ message: 'Forbidden' })

    // עדכון פרטים משותפים
    appointment.serviceId = serviceId
    appointment.startTime = startTime
    appointment.lengthTime = lengthTime
    appointment.branch = branch
    appointment.notes = notes

    // המנהלת יכולה לעדכן פרטים נוספים
    if (isAdmin) {
      if (providerId)
        appointment.providerId = providerId

      if (status !== undefined)
        appointment.status = status

      if (maxParticipants !== undefined) {
        if (!Number.isInteger(maxParticipants) || maxParticipants < 1)
          return res.status(400).json({ message: 'Invalid maxParticipants' })
      }
      if (maxParticipants < appointment.participants.length)
        return res.status(400).json({ message: 'maxParticipants cannot be less than current participants' })

      appointment.maxParticipants = maxParticipants
    }

    appointment.status = appointment.participants.length >= appointment.maxParticipants ? 'booked' : 'empty'

    appointment.status =
      appointment.participants.length >= appointment.maxParticipants
        ? 'booked'
        : 'empty'

    return res.json({
      message: 'Appointment updated',
      appointment: updatedAppointment
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

const deleteAppointment = async (req, res) => {
  try {
    const currentUser = req.user
    const { id } = req.body

    if (!id)
      return res.status(400).json({ message: 'id is required' })

    const appointment = await Appointment.findById(id).exec()

    if (!appointment)
      return res.status(404).json({ message: 'Appointment not found' })

    const isAdmin =
      currentUser.type === 'Provider' &&
      currentUser.role?.includes('Admin')

    const isProvider =
      currentUser.type === 'Provider' &&
      !isAdmin &&
      appointment.providerId.toString() === currentUser._id

    if (!isAdmin && !isProvider)
      return res.status(403).json({ message: 'Forbidden' })

    await appointment.deleteOne()

    return res.json({
      message: 'Appointment deleted successfully'
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

const getAvailableAppointments = async (req, res) => {
  try {
    const now = new Date()

    const appointments = await Appointment.find({
      startTime: { $gte: now },
      status: 'empty',
      $expr: {
        $lt: [
          { $size: { $ifNull: ['$participants', []] } },
          '$maxParticipants'
        ]
      }
    }).populate('providerId', 'name lastName').populate('serviceId').sort({ startTime: 1 }).lean()

    res.json(appointments)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

const bookAppointment = async (req, res) => {
  try {
    const currentUser = req.user
    const { id } = req.params
    const { clientId } = req.body

    const isAdmin = currentUser.type === 'Provider' && currentUser.role?.includes('Admin')
    const isClient = currentUser.type === 'User'

    if (!isAdmin && !isClient)
      return res.status(403).json({ message: 'Forbidden' })

    const appointmentClientId = isAdmin ? clientId : currentUser._id

    if (!appointmentClientId)
      return res.status(400).json({ message: 'clientId is required' })

    const appointment = await Appointment.findOneAndUpdate(
      {
        _id: id,
        status: 'empty',
        startTime: { $gt: new Date() },
        participants: { $ne: appointmentClientId },
        $expr: {
          $lt: [
            { $size: { $ifNull: ['$participants', []] } },
            '$maxParticipants'
          ]
        }
      },
      {
        $addToSet: {
          participants: appointmentClientId
        }
      },
      {
        new: true,
        runValidators: true
      }
    ).exec()

    if (!appointment)
      return res.status(400).json({
        message: 'Class is full or client is already registered'
      })

    appointment.status =
      appointment.participants.length >= appointment.maxParticipants ? 'booked' : 'empty'
    await appointment.save()

    return res.status(200).json({
      message: 'Successfully registered for group class',
      appointment
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

const cancelAppointment = async (req, res) => {
  try {
    const currentUser = req.user
    const { id, clientId, confirm } = req.body

    const isAdmin = currentUser.type === 'Provider' && currentUser.role?.includes('Admin')
    const isClient = currentUser.type === 'User'

    if (!isAdmin && !isClient) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    const appointment = await Appointment.findById(id)

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' })
    }

    const targetClient = isAdmin ? clientId : currentUser._id

    if (!targetClient) {
      return res.status(400).json({ message: 'clientId is required' })
    }

    if (appointment.startTime <= new Date()) {
      return res.status(400).json({ message: 'Appointment already started' })
    }

    const deadline = new Date(appointment.startTime).getTime() - 3600000
    // אם עבר זמן הביטול המותר
    if (Date.now() > deadline) {
      if (!isAdmin)
        return res.status(400).json({ message: `Cancellation must be at least 1 hour before the appointment` })
      // המנהלת צריכה לאשר ביטול מאוחר
      if (!confirm)
        return res.status(409).json({
          message: `Less than 1 hour remain. Are you sure you want to cancel this booking?`,
          requiresConfirmation: true
        })
    }

    const isParticipant = appointment.participants.some(
      p => p.toString() === targetClient.toString()
    )

    if (!isParticipant)
      return res.status(400).json({ message: 'Client is not registered' })

    appointment.participants = appointment.participants.filter(
      p => p.toString() !== targetClient.toString()
    )
    appointment.status = 'empty'

    await appointment.save()

    return res.json({
      message: 'Booking cancelled successfully',
      appointment
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

const getMyAppointments = async (req, res) => {
  try {
    const currentUser = req.user
    const isAdmin = currentUser.type === 'Provider' && currentUser.role?.includes('Admin')
    const isClient = currentUser.type === 'User'

    if (!isAdmin && !isClient)
      return res.status(403).json({ message: 'Forbidden' })

    const filter = isAdmin ? { 'participants.0': { $exists: true } } : { participants: currentUser._id }
    const appointments = await Appointment.find(filter).populate('providerId', 'name lastName').populate('serviceId', 'name description price').sort({ startTime: 1 }).lean()

    return res.json(appointments)
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'Server error'
    })
  }
}

module.exports = {
  getAllAppointments,
  createNewAppointment,
  getAppointmentById,
  getAppointmentParticipants,
  updateAppointment,
  deleteAppointment,
  getAvailableAppointments,
  bookAppointment,
  cancelAppointment,
  getMyAppointments
}