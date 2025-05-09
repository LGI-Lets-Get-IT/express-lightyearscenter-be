const Joi = require("joi");

exports.appointmentSchema = {
  create: Joi.object({
    title: Joi.string().required(),
    client: Joi.number().required(),
    picId: Joi.number().required(),
    appointmentDate: Joi.string().required(),
    appointmentTime: Joi.string().required(),
    appointmentType: Joi.string().required(),
    timeStart: Joi.date().greater("now").required(),
    timeEnd: Joi.date().greater(Joi.ref("timeStart")).required(),
  }),

  //   create: Joi.object({
  //     title: Joi.string().required(),
  //     clientId: Joi.number().required(),
  //     psychologistId: Joi.number().required(),
  //     referenceCode: Joi.string().allow(""), // optional, can be empty
  //     bookingTimeStart: Joi.date().greater("now").required(),
  //     bookingTimeEnd: Joi.date().greater(Joi.ref("bookingTimeStart")).required(),
  //   }),

  update: Joi.object({
    appointmentId: Joi.number().required(),

    psychologistId: Joi.number().optional(),
    clientId: Joi.number().optional(),
    timeStart: Joi.date().greater("now").optional(),
    // timeEnd: Joi.date().greater('timeStart').optional(),
  }),

  delete: Joi.object({
    appointmentIds: Joi.array().items(Joi.number()).required(),
  }),
};
