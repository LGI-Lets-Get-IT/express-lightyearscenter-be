const Joi = require("joi");

exports.appointmentSchema = {
  create: Joi.object({
    title: Joi.string().required(),
    clientId: Joi.number().required(),
    picId: Joi.number().required(),
    roomId: Joi.number().required(),
    appointmentType: Joi.string().required(),
    appointmentDate: Joi.string().required(),
    timeStart: Joi.date().greater("now").required(),
    timeEnd: Joi.date().greater(Joi.ref("timeStart")).required(),
    treatmentId: Joi.number().when("appointmentType", {
      is: "Treatment",
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    numberOfRepetition: Joi.number().when("appointmentType", {
      is: "Treatment",
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    therapyDays: Joi.array().when("appointmentType", {
      is: "Treatment",
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
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
    title: Joi.string().optional(),
    appointmentId: Joi.number().optional(),
    clientId: Joi.number().optional(),
    picId: Joi.number().optional(),
    roomId: Joi.number().optional(),
    appointmentType: Joi.string().optional(),
    appointmentDate: Joi.string().optional(),
    timeStart: Joi.date().greater("now").optional(),
    timeEnd: Joi.date().greater(Joi.ref("timeStart")).optional(),
    isConfirmed: Joi.boolean().optional(),
  }),

  delete: Joi.object({
    appointmentIds: Joi.array().items(Joi.number()).required(),
  }),
};
