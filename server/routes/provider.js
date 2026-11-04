const express = require("express")
const router = express.Router()
const providerController = require("../controllers/providerController")
const verifyJWT = require("../middleware/verifyJWT")
const verifyAdmin = require("../middleware/verifyAdmin")

router.use(verifyJWT)

router.post("/", verifyAdmin, providerController.createNewProvider)
router.get("/", verifyAdmin, providerController.getAllProviders)
router.get("/:id", providerController.getProviderById)
router.delete("/:id", verifyAdmin, providerController.deleteProvider)
router.put("/", providerController.updateProvider)

module.exports = router
