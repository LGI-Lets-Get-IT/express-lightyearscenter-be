const { isAllowedOrigin } = require('../config/allowedOrigins.config')

const credentials = (req, res, next) => {
    const origin = req.headers.origin
    if(isAllowedOrigin(origin)) {
        res.header('Access-Control-Allow-Credentials', true)
        return next()
    }
    res.jsonFailed(403, "You are not allowed to access!")
}

module.exports = credentials