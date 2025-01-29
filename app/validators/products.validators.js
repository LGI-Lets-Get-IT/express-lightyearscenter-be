const Joi = require('joi')

const productSchema = {
    create: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required()
    }),

    update: Joi.object({
        name: Joi.string().required()
    })
}

module.exports = productSchema