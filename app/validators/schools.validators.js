const Joi = require("joi");

exports.schoolSchema = {
  view: Joi.object({
    schoolId: Joi.number().required(),
  }),

  create: Joi.object({
    schoolName: Joi.string().min(3).required(),
    schoolAddress: Joi.string().min(3).required(),
    schoolPhoneNumber: Joi.string().required(),
    schoolEmail: Joi.string().email().required(),
    picName: Joi.string().min(3).required(),
    picEmail: Joi.string().email().required(),
    picPhoneNumber: Joi.string().required(),
  }),

  update: Joi.object({
    id: Joi.number().required(),
    name: Joi.string().min(3).optional(),
    picName: Joi.string().min(3).optional(),
    address: Joi.string().min(3).optional(),
    phoneNumber: Joi.string().optional(),
    email: Joi.string().email().optional(),
  }),
};
