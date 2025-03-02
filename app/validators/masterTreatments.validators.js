const Joi = require('joi')

exports.masterTreatmentSchema = {
    create: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
    }),

    update: Joi.object({
        name: Joi.string().optional(),
        description: Joi.string().optional(),
        is_active: Joi.boolean().optional(),
    }),
}