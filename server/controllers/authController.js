

const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const User = require('../models/User')
const Provider = require('../models/provider')


const register = async (req, res) => {
    try {
        const {
            name,
            lastName,
            username,
            idNumber,
            email,
            password,
            phone
        } = req.body

        if (!name || !lastName || !username ||
            !idNumber || !email || !password) {
            return res.status(400).json({
                message: 'All fields are required'
            })
        }

        const duplicate = await User.findOne({
            $or: [{ username }, { email }, { idNumber }]
        }).lean()

        if (duplicate) {
            return res.status(409).json({
                message: 'Username, email or ID number already exists'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            lastName,
            username,
            idNumber,
            email,
            phone,
            password: hashedPassword
        })

        return res.status(201).json({
            message: `New user ${user.username} created`
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'Username, email or ID number already exists'
            })
        }

        console.error(error)
        return res.status(500).json({
            message: 'Server error'
        })
    }
}


const login = async (req, res) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({
                message: 'Username and password are required'
            })
        }

        const foundUser = await User.findOne({ username }).lean()
        
        if (!foundUser || !await bcrypt.compare(password, foundUser.password)) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        if (!process.env.ACCESS_TOKEN_SECRET) {
            throw new Error('ACCESS_TOKEN_SECRET is not configured')
        }

        const accessToken = jwt.sign(
            {
                UserInfo: {
                    _id: foundUser._id.toString(),
                    username: foundUser.username,
                    type: 'User'
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        )

        return res.json({ accessToken })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Server error' })
    }
}


const registerProvider = async (req, res) => {
    try {
        const currentUser = req.user

        if (
            currentUser?.type !== 'Provider' ||
            !currentUser.role?.includes('Admin')
        ) {
            return res.status(403).json({ message: 'Forbidden' })
        }

        const {
            name,
            lastName,
            username,
            id,
            email,
            password,
            phone,
            service
        } = req.body

        if (!name || !lastName || !username ||
            !id || !email || !password || !service) {
            return res.status(400).json({
                message: 'All required fields must be provided'
            })
        }

        const duplicate = await Provider.findOne({
            $or: [{ username }, { email }, { id }]
        }).lean()

        if (duplicate) {
            return res.status(409).json({
                message: 'Username, email or ID already exists'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const provider = await Provider.create({
            name,
            lastName,
            username,
            id,
            email,
            password: hashedPassword,
            phone,
            service,
            role: ['Provider']
        })

        return res.status(201).json({
            message: `Provider ${provider.username} created successfully`
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'Username, email or ID already exists'
            })
        }

        console.error(error)
        return res.status(500).json({
            message: 'Server error'
        })
    }
}


const loginProvider = async (req, res) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({
                message: 'Username and password are required'
            })
        }

        const foundProvider = await Provider.findOne({ username }).lean()
      
        if (!foundProvider || !await bcrypt.compare(password, foundProvider.password)) {
            return res.status(401).json({ message: 'Unauthorized'})
        }

        if (!process.env.ACCESS_TOKEN_SECRET) {
            throw new Error('ACCESS_TOKEN_SECRET is not configured')
        }

        const accessToken = jwt.sign(
            {
                UserInfo: {
                    _id: foundProvider._id.toString(),
                    username: foundProvider.username,
                    type: 'Provider',
                    role: foundProvider.role
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        )

        return res.json({ accessToken })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: 'Server error'
        })
    }
}

module.exports = {
    register,
    login,
    registerProvider,
    loginProvider
}
