const Joi = require('joi')

exports.appointmentSchema = {
    create: Joi.object({
        psychologistId: Joi.number().required(),
        client: Joi.string().uuid({
            version: ['uuidv4'],
        }).required(),
        timeStart: Joi.date().greater('now').required(),
        timeEnd: Joi.date().greater(Joi.ref('timeStart')).required(),
        refCode: Joi.string().required(),
    }),
    
    update: Joi.object({
        psychologistId: Joi.number().optional(),
        clientId: Joi.number().optional(),
        timeStart: Joi.date().greater('now').optional(),
        // timeEnd: Joi.date().greater('timeStart').optional(),
    }),
}