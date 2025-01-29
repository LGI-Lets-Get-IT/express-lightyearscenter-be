const validateInput = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false })
        
        if(error) {
            const errorMessages = errors.details.map(err => err.message)
            console.log('ERRORSSS', error.details.length, error.details)
            return res.status(400).json(error.details)
        }

        next()

        return { error, value }
    }
}

module.exports = {
    validateInput
}