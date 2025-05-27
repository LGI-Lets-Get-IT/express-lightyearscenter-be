const Joi = require("joi").extend(require("@joi/date"));

exports.clientSchema = {
  view: Joi.object({
    clientUuid: Joi.string().uuid().required(),
  }),

  create: Joi.object({
    schoolId: Joi.number().required(),
    fullName: Joi.string().min(3).required(),
    nationality: Joi.string().required(),
    dateOfBirth: Joi.date().required(),
    gender: Joi.string().valid("Male", "Female").required(),
    className: Joi.string().required(),
    problem: Joi.string().required(),
    guardianName: Joi.string().min(3).required(),
    guardianPhone: Joi.string().required(),
    guardianEmail: Joi.string().email().required(),
    guardianRelationship: Joi.string().required(),
    guardianNationality: Joi.string().required(),

    // Client Intake Forms
    intakeForm: Joi.object({
      placeOfBirth: Joi.string().allow(null),
      religion: Joi.string().allow(null),
      homeAddress: Joi.string().allow(null),
      previousOngoingActivity: Joi.string().allow(null),
      majorReasonConcerns: Joi.string().allow(null),
      previousPsychologicalDetails: Joi.string().allow(null),
      socialAbilities: Joi.string().allow(null),
      relationshipAbilities: Joi.string().allow(null),
      healthAbilities: Joi.string().allow(null),
      mathAbilities: Joi.string().allow(null),
      programsExpectations: Joi.string().allow(null),
      howHeardAboutUs: Joi.string().allow(null),
      childBirthOrder: Joi.string().allow(null),
      institutions: Joi.array().items(
        Joi.object({
          institutionName: Joi.string().required('Please enter the institution name'),
          age: Joi.number().required('Please enter the age instituon taken'),
          activity: Joi.string().required('Please enter the activity'),
          duration: Joi.string().required('Please enter the duration of the activity'),
        })
      ),
      guardians: Joi.array().items(
        Joi.object({
          guardianName: Joi.string().required('Please enter the guardian name'),
          relationship: Joi.string().required('Please enter the guardian relationship to child'),
          placeOfBirth: Joi.string().required('Please enter the guardian place of birth'),
          dateOfBirth: Joi.date().required('Please enter the guardian date of birth'),
          gender: Joi.string().required('Please enter the guardian gender'),
          education: Joi.string().required('Please enter the guardian education'),
          job: Joi.string().required('Please enter the guardian job'),
        })
      ),
    })
  }),

  updatePassword: Joi.object({
    clientUuid: Joi.string().uuid().required(),

    password: Joi.string().min(8).required(),
    passwordConfirm: Joi.string().valid(Joi.ref('password')).required(),
  }),

  update: Joi.object({
    clientUuid: Joi.string().uuid().required(), //req.params.clientId

    schoolId: Joi.number().required(),
    fullName: Joi.string().min(3).required(),
    nationality: Joi.string().required(),
    dateOfBirth: Joi.date().required(),
    gender: Joi.string().valid("Male", "Female").required(), // enum
    className: Joi.string().required(),
    problem: Joi.string().required(),
    guardianName: Joi.string().min(3).required(),
    guardianPhone: Joi.string().required(),
    guardianEmail: Joi.string().email().required(),
    guardianRelationship: Joi.string().required(),
    guardianNationality: Joi.string().required(),
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
