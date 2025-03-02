const Joi = require('joi')

exports.appointmentSchema = {
    create: Joi.object({
        psychologist_id: Joi.number().required(),
        client_id: Joi.number().required(),
        booking_time_start: Joi.date().greater('now').required(),
        booking_time_end: Joi.date().greater('booking_time_start').required(),
    }),
    
    update: Joi.object({
        psychologist_id: Joi.number().optional(),
        client_id: Joi.number().optional(),
        booking_time_start: Joi.date().greater('now').optional(),
        booking_time_end: Joi.date().greater('booking_time_start').optional(),
    }),
}