const Joi = require("joi");

const exportCsvSchema = Joi.object().keys({
    type: Joi.string().required().valid("book", "magazine"),
    title: Joi.string().required(),
    authors: Joi.string().required(),
    isbn: Joi.string().required(),
    description: Joi.string(),
    publishedAt: Joi.string()
});

module.exports = exportCsvSchema;