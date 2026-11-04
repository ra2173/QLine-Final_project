const express = require("express")
const router = express.Router()
const waitlistController = require("../controllers/waitlistController")
const verifyJWT = require("../middleware/verifyJWT")
router.use(verifyJWT)

router.get("/my-waitlist", waitlistController.getMyWaitlist)
router.get("/", waitlistController.getAllWaitlistEntries)
router.get("/:id", waitlistController.getWaitlistEntryById)
router.post("/", waitlistController.createNewWaitlistEntry)
router.delete("/", waitlistController.deleteWaitlistEntry)
router.put("/", waitlistController.updateWaitlistEntry)

module.exports = router
