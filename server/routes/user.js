const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")

const verifyJWT = require("../middleware/verifyJWT")
const verifyAdmin = require("../middleware/verifyAdmin")
const verifyProvider = require("../middleware/verifyProvider")

router.use(verifyJWT)

router.post("/", verifyAdmin, userController.createNewUser)
router.get("/", verifyAdmin, userController.getAllUsers)
router.get('/provider/clients', verifyProvider, userController.getProviderClients)
router.get("/:id", userController.getUserById)
router.delete("/", verifyAdmin, userController.deleteUser)
router.put("/", userController.updateUser)

module.exports = router