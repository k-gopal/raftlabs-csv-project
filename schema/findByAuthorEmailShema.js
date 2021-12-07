const Joi = require("joi");

const findByAuthorEmailSchema = Joi.object().keys({
    email: Joi.string().required()
});

module.exports = findByAuthorEmailSchema;