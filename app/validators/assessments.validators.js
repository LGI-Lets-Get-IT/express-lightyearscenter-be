const Joi = require("joi");

exports.assessmentSchema = {
  create: Joi.object({
    appointmentId: Joi.number().required(),
    clientId: Joi.number().required(),
    psychologistId: Joi.number().required(),
    testId: Joi.number().required(),
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
