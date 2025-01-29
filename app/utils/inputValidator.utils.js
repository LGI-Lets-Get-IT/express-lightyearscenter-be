const validateInput = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false, escapeHtml: true })
        
        if(error) {
            const errorMessages = error.details.map(err => err.message)

            return res.jsonFailed(400, {
                indonesian: "Validasi error",
                english: "Validation error"
            }, errorMessages)
        }

        next()

        return { error, value }
    }
}

module.exports = {
    validateInput
}