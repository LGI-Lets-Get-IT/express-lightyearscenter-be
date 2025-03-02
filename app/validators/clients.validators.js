const Joi = require('joi')

exports.clientSchema = {
    create: Joi.object({
        school_id: Joi.string().required(),
        full_name: Joi.string().required(),
        guardian_name: Joi.string().required(),
        guardian_phone: Joi.string().required(),
        guardian_email: Joi.string().email().required(),
        guardian_relationship: Joi.string().required(),
        age: Joi.number().required(),
        date_of_birth: Joi.number().required(),
        gender: Joi.string().valid(['Male', 'Female']).required(), // enum
        address: Joi.string().required(),
        phone_number: Joi.string().required(),
        email: Joi.string().email().required()
    }),

    update: Joi.object({
        school_id: Joi.string().optional(),
        full_name: Joi.string().optional(),
        guardian_name: Joi.string().optional(),
        guardian_phone: Joi.string().optional(),
        guardian_email: Joi.string().email().optional(),
        guardian_relationship: Joi.string().optional(),
        age: Joi.number().optional(),
        date_of_birth: Joi.number().optional(),
        gender: Joi.string().valid(['Male', 'Female']).optional(), // enum
        address: Joi.string().optional(),
        phone_number: Joi.string().optional(),
        email: Joi.string().email().optional()
    }),
}