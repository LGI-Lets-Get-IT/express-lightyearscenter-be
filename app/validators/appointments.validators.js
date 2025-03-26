const Joi = require('joi')

exports.appointmentSchema = {
    create: Joi.object({
        psychologistId: Joi.number().required(),
        client: Joi.string().uuid({
            version: ['uuidv4'],
        }).required(),
        timeStart: Joi.date().greater('now').required(),
        timeEnd: Joi.date().greater(Joi.ref('timeStart')).required(),
    }),
    
    update: Joi.object({
        appointmentId: Joi.number().required(),

        psychologistId: Joi.number().optional(),
        clientId: Joi.number().optional(),
        timeStart: Joi.date().greater('now').optional(),
        // timeEnd: Joi.date().greater('timeStart').optional(),
    }),

    delete: Joi.object({
        appointmentIds: Joi.array().items(Joi.number()).required(),
    }),
}