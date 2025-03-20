const Joi = require('@hapi/joi');

// Register validation
const registerValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(5).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        profile_picture: Joi.string(),
        // role: Joi.string().valid('user', 'storemanager', 'admin').required(),
        // expertise: Joi.string().when('role', { is: 'instructor', then: Joi.required() }),
        // bio: Joi.string().when('role', { is: 'instructor', then: Joi.required() })
    });

    return schema.validate(data);
};

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
