const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const verifyJWT = require('../middleware/verifyJWT')
const verifyAdmin = require('../middleware/verifyAdmin')


router.post('/register', authController.register)
router.post('/login', authController.login)


router.post('/provider/login', authController.loginProvider)

router.post('/provider/register', verifyJWT, verifyAdmin, authController.registerProvider)

module.exports = router