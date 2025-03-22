const Joi = require("joi").extend(require("@joi/date"));

exports.clientSchema = {
  view: Joi.object({
    clientId: Joi.string().required(),
  }),

  create: Joi.object({
    schoolId: Joi.number().required(),
    fullName: Joi.string().min(3).required(),
    nationality: Joi.string().required(),
    age: Joi.number().required(),
    // dateOfBirth: Joi.date().format("YYYY-MM-DD").required(),
    dateOfBirth: Joi.date().required(),
    gender: Joi.string().valid("Male", "Female").required(), // enum
    guardianName: Joi.string().min(3).required(),
    guardianPhone: Joi.string().required(),
    guardianEmail: Joi.string().email().required(),
    guardianRelationship: Joi.string().required(),
    guardianNationality: Joi.string().required(),
  }),

  update: Joi.object({
    clientId: Joi.string()
      .uuid({
        version: ["uuidv4"],
      })
      .required(), //req.params.clientId

    schoolId: Joi.number().optional(),
    fullName: Joi.string().min(3).optional(),
    nationality: Joi.string().optional(),
    age: Joi.number().optional(),
    // dateOfBirth: Joi.date().format("YYYY-MM-DD"),
    dateOfBirth: Joi.date(),
    gender: Joi.string().valid("Male", "Female").optional(), // enum
    guardianName: Joi.string().min(3).optional(),
    guardianPhone: Joi.string().optional(),
    guardianEmail: Joi.string().email().optional(),
    guardianRelationship: Joi.string().optional(),
    guardianNationality: Joi.string().optional(),
  }),

  delete: Joi.object({
    clientIds: Joi.array()
      .items(
        Joi.string().uuid({
          version: ["uuidv4"], // Ensures UUID is v4
        })
      )
      .required(), // Ensure it's an array
  }),

  // delete: Joi.object({
  //   // clientIds: Joi.array().items(Joi.number()).required(),
  //   clientIds: Joi.array()
  //     .uuid({
  //       version: ["uuidv4"],
  //     })
  //     .required(), //req.params.clientId
  // }),
};
