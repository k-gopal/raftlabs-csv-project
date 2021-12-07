const Joi = require("joi");

const readCsvSchema = Joi.object().keys({
    type: Joi.array().required().items(Joi.string().required().valid("all", "authors", "books", "magazines"))
});

module.exports = readCsvSchema;