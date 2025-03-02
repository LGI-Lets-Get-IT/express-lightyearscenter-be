const Joi = require('joi')

exports.schoolSchema = {
    view: Joi.object({
        id: Joi.number().required()
    }),

    create: Joi.object({
        name: Joi.string().min(3).required(),
        picName: Joi.string().min(3).required(),
        address: Joi.string().min(3).required(),
        phoneNumber: Joi.string().required(),
        email: Joi.string().email().required()
    }),

    update: Joi.object({
        id: Joi.number().required(),
        name: Joi.string().min(3).optional(),
        picName: Joi.string().min(3).optional(),
        address: Joi.string().min(3).optional(),
        phoneNumber: Joi.string().optional(),
        email: Joi.string().email().optional()
    }),
}