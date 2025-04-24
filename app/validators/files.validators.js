const Joi = require("joi");

exports.filesSchema = {
    view: Joi.object({
        appointmentId: Joi.number().required(),
        uuid: Joi.string().uuid().required(),
        clientName: Joi.string().required(),
    }),
    upload: Joi.object({
        fileName: Joi.string().required(),
        fileType: Joi.string().valid("image", "video", "document").required(),
        uploadedBy: Joi.string().uuid().required(),
        uploadedAt: Joi.date().default(Date.now),
    }),
    delete: Joi.object({
        fileIds: Joi.array().items(Joi.number()).required(),
    })
};