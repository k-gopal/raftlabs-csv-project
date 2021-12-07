const Joi = require("joi");

const findBookMagazineSchema = Joi.object().keys({
    ISBN: Joi.string().required()
});

module.exports = findBookMagazineSchema;