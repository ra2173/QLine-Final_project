const express = require("express")
const router = express.Router()
const serviceController = require("../controllers/serviceController")
const verifyJWT = require("../middleware/verifyJWT")
const verifyProvider = require("../middleware/verifyProvider")

router.use(verifyJWT)

router.get("/", serviceController.getAllServices)
router.get("/my-services", serviceController.getMyServices)
router.get("/:id", serviceController.getServiceById)
router.post("/", verifyProvider, serviceController.createNewService)
router.delete("/", verifyProvider, serviceController.deleteService)
router.put("/", verifyProvider, serviceController.updateService)

module.exports = router
