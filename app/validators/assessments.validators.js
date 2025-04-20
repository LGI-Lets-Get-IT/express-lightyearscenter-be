const Joi = require("joi");

exports.assessmentSchema = {
  create: Joi.object({
    appointmentId: Joi.number().required(),
    client: Joi.string().uuid().message('Client ID format is not valid').required(),
    psychologistId: Joi.number().required(),
    testType: Joi.number().required(),
    result: Joi.string().required(),
  }),

  update: Joi.object({
    assessmentId: Joi.number().required(),

    appointmentId: Joi.number().optional(),
    client: Joi.string().uuid().required(),
    psychologistId: Joi.number().optional(),
    testType: Joi.number().optional(),
    result: Joi.string().optional(),
  }),

  delete: Joi.object({
    assessmentIds: Joi.array().items(Joi.number()).required(),
  }),
};
