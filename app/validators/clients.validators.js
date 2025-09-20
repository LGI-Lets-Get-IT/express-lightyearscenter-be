const Joi = require("joi").extend(require("@joi/date"));

exports.clientSchema = {
  view: Joi.object({
    clientUuid: Joi.string().uuid().required(),
  }),

  create: Joi.object({
    password: Joi.string().min(8).required("Please enter the password"),
    passwordConfirm: Joi.string().valid(Joi.ref("password")).required(),

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
    // intakeForm: Joi.object({
    //   placeOfBirth: Joi.string().required('Please enter the child\'s place of birth'),
    //   religion: Joi.string().required('Please enter the child\'s religion'),
    //   homeAddress: Joi.string().required('Please enter the home address'),
    //   previousOngoingActivity: Joi.string().required('Please enter the previous ongoing activity'),
    //   majorReasonConcerns: Joi.string().required('Please enter the major reason concerns of the child'),
    //   previousPsychologicalDetails: Joi.string().required('Please enter the previous psychological details of the child'),
    //   socialAbilities: Joi.string().required('Please enter the social ability'),
    //   relationshipAbilities: Joi.string().required('Pleas enter the relationship ability'),
    //   healthAbilities: Joi.string().required('Please enter the health ability'),
    //   mathAbilities: Joi.string().required('Please enter the math ability'),
    //   programsExpectations: Joi.string().required('Please enter the program expectations'),
    //   howHeardAboutUs: Joi.string().required('Please enter the referral source'),
    //   childBirthOrder: Joi.string().required('Please enter the child birth order'),
    //   institutions: Joi.array().items(
    //     Joi.object({
    //       institutionName: Joi.string().required('Please enter the institution name'),
    //       age: Joi.number().required('Please enter the age instituon taken'),
    //       activity: Joi.string().required('Please enter the activity'),
    //       duration: Joi.string().required('Please enter the duration of the activity'),
    //     })
    //   ),
    //   guardians: Joi.array().items(
    //     Joi.object({
    //       guardianName: Joi.string().required('Please enter the guardian name'),
    //       relationship: Joi.string().required('Please enter the guardian relationship to child'),
    //       placeOfBirth: Joi.string().required('Please enter the guardian place of birth'),
    //       dateOfBirth: Joi.date().required('Please enter the guardian date of birth'),
    //       gender: Joi.string().required('Please enter the guardian gender'),
    //       education: Joi.string().required('Please enter the guardian education'),
    //       job: Joi.string().required('Please enter the guardian job'),
    //     })
    //   ),
    // })
  }),

  updatePassword: Joi.object({
    clientUuid: Joi.string().uuid().required(),

    password: Joi.string().min(8).required(),
    passwordConfirm: Joi.string().valid(Joi.ref("password")).required(),
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

    intakeForm: Joi.object({
      placeOfBirth: Joi.string().required(
        "Please enter the child's place of birth"
      ),
      religion: Joi.string().required("Please enter the child's religion"),
      homeAddress: Joi.string().required("Please enter the home address"),
      previousOngoingActivity: Joi.string().required(
        "Please enter the previous ongoing activity"
      ),
      majorReasonConcerns: Joi.string().required(
        "Please enter the major reason concerns of the child"
      ),
      previousPsychologicalDetails: Joi.string().required(
        "Please enter the previous psychological details of the child"
      ),
      socialAbilities: Joi.string().required("Please enter the social ability"),
      relationshipAbilities: Joi.string().required(
        "Pleas enter the relationship ability"
      ),
      healthAbilities: Joi.string().required("Please enter the health ability"),
      mathAbilities: Joi.string().required("Please enter the math ability"),
      programsExpectations: Joi.string().required(
        "Please enter the program expectations"
      ),
      howHeardAboutUs: Joi.string().required(
        "Please enter the referral source"
      ),
      childBirthOrder: Joi.string().required(
        "Please enter the child birth order"
      ),
      institutions: Joi.array().items(
        Joi.object({
          institutionName: Joi.string().required(
            "Please enter the institution name"
          ),
          age: Joi.number().required("Please enter the age instituon taken"),
          activity: Joi.string().required("Please enter the activity"),
          duration: Joi.string().required(
            "Please enter the duration of the activity"
          ),
        })
      ),
      guardians: Joi.array().items(
        Joi.object({
          guardianName: Joi.string().required("Please enter the guardian name"),
          relationship: Joi.string().required(
            "Please enter the guardian relationship to child"
          ),
          placeOfBirth: Joi.string().required(
            "Please enter the guardian place of birth"
          ),
          dateOfBirth: Joi.date().required(
            "Please enter the guardian date of birth"
          ),
          gender: Joi.string().required("Please enter the guardian gender"),
          education: Joi.string().required(
            "Please enter the guardian education"
          ),
          job: Joi.string().required("Please enter the guardian job"),
        })
      ),
    }),
  }),

  updateIntakeFormLink: Joi.object({
    clientUuid: Joi.string().uuid().required(), //req.params.clientId
    intakeFormLink: Joi.string().required(),
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
