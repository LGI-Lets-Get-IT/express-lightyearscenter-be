const Joi = require("joi");

exports.treatmentPlanSchema = {
  view: Joi.object({
    planId: Joi.number().required(),
  }),

  create: Joi.object({
    clientId: Joi.number().required(),
    psychologistId: Joi.number().required(),
    presentProblem: Joi.string().required(),
    consultDate: Joi.date().greater("now").required(),
    parentPlan: Joi.string().required(),
    programs: Joi.array().items(
      Joi.object({
        treatmentId: Joi.number().required(),
        therapistId: Joi.number().required(),
        aimOfTreatment: Joi.string().required(),
        sessionFrequency: Joi.number().min(1).required(),
        sessionDuration: Joi.number().min(1).required(),
      })
    ),
    targets: Joi.array().items(
      Joi.object({
        behavior: Joi.string().required(),
        currentAbility: Joi.string().required(),
        shortTermTarget: Joi.string().required(),
        mediaTools: Joi.string().required(),
      })
    ),
  }),

  update: Joi.object({
    planId: Joi.number().optional(),
    problem: Joi.string().optional(),
    consultDate: Joi.date().greater("now").optional(),
    parentPlan: Joi.string().optional(),
  }),

  delete: Joi.object({
    planId: Joi.array().items(Joi.number()).required(),
  }),
};
