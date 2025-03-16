const validateInput = (schema) => {
    return (req, res, next) => {
        const dataToValidate = {
            ...req.params,
            ...req.body,
            ...req.query,
        }
        const { error, value } = schema.validate(dataToValidate, { abortEarly: false, escapeHtml: true })
        
        if(error) {
            const errorMessages = error.details.map(err => err.message)

            return res.jsonFailed(400, "Validation error", errorMessages)
        }
        next()

        return { error, value }
    }
}

module.exports = {
    validateInput
}