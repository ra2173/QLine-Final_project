
const verifyClient = (req, res, next) => {
    if (req.user?.type !== 'User') {
        return res.status(403).json({
            message: 'Forbidden: Clients only'
        })
    }

    next()
}

module.exports = verifyClient