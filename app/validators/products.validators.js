const Joi = require('joi')

exports.productSchema = {
    create: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        ingredients: Joi.object().required(),
        product_category: Joi.number().required()
    }),

    update: Joi.object({
        name: Joi.string().required()
    })
}

exports.productCategorySchema = {
    create: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required()
    })
}