const Joi = require("joi");

exports.authSchema = {
  login: Joi.object({
    email: Joi.string().required('Email is required').email(),
    password: Joi.string().required('Password is required'),
  }),
};
