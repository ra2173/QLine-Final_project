
const verifyProvider = (req, res, next) => {
    if (
        req.user?.type !== 'Provider' ||
        (!req.user.role?.includes('Provider') && !req.user.role?.includes('Admin'))
    ) {
        return res.status(403).json({
            message: 'Forbidden: Providers only'
        });
    }

    next();
};

module.exports = verifyProvider;
