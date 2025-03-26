const Joi = require('joi')

exports.roleSchema = {
    create: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
    }),

    update: Joi.object({
        name: Joi.string().optional(),
        description: Joi.string().optional(),
    }),
}