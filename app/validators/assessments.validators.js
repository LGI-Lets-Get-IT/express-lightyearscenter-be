const Joi = require("joi");

exports.assessmentSchema = {
  view: Joi.object({
    assessmentId: Joi.number().required(),
  }),

  create: Joi.object({
    appointmentId: Joi.number().required(),
    clientId: Joi.number().required(),
    psychologistId: Joi.number().required(),
    testId: Joi.number().required(),
    result: Joi.string().required(),
  }),

  update: Joi.object({
    assessmentId: Joi.number().required(),

    appointmentId: Joi.number().required(),
    clientId: Joi.number().required(),
    psychologistId: Joi.number().required(),
    testId: Joi.number().required(),
    result: Joi.string().required(),
  }),

  delete: Joi.object({
    assessmentIds: Joi.array().items(Joi.number()).required(),
  }),
};
