const Joi = require("joi");

exports.treatmentSessionSchema = {
  view: Joi.object({
    planId: Joi.number().required(),
  }),

  create: Joi.object({
    appointmentId: Joi.number().required(),
    clientId: Joi.number().required(),
    programId: Joi.number().required(),
    planId: Joi.number().required(),
    sessions: Joi.array().items(Joi.object({
        shortTermGoals: Joi.string().required(),
        activity: Joi.string().required(),
        progress: Joi.string().required(),
    })),
  }),

  update: Joi.object({
    appointmentId: Joi.number().required(),
    clientId: Joi.number().required(),
    programId: Joi.number().required(),
    planId: Joi.number().required(),
    sessions: Joi.array().items(Joi.object({
        shortTermGoals: Joi.string().required(),
        activity: Joi.string().required(),
        progress: Joi.string().required(),
    })),
  }),

  delete: Joi.object({
    sessionIds: Joi.array().items(Joi.number()).required(),
  }),
};
