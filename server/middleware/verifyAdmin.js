const verifyAdmin = (req, res, next) => {
    if (
        req.user?.type !== 'Provider' ||
        !req.user.role?.includes('Admin')
    ) {
        return res.status(403).json({
            message: 'Forbidden: Admins only'
        })
    }

    next()
}

module.exports = verifyAdmin