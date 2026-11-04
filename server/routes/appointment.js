const express = require("express")
const router = express.Router()
const appointmentController = require("../controllers/appointmentController")
const verifyJWT = require("../middleware/verifyJWT")
const verifyProvider = require("../middleware/verifyProvider")

router.use(verifyJWT)

router.get("/", appointmentController.getAllAppointments)
router.post("/", verifyProvider, appointmentController.createNewAppointment)
router.delete("/", appointmentController.deleteAppointment)
router.get('/:id/participants', appointmentController.getAppointmentParticipants)
router.put("/", appointmentController.updateAppointment)
router.get("/available", appointmentController.getAvailableAppointments)
router.post("/:id/book", appointmentController.bookAppointment)
router.put("/cancel", appointmentController.cancelAppointment)
router.get("/my-appointments", appointmentController.getMyAppointments)
router.get("/:id", appointmentController.getAppointmentById)


module.exports = router
