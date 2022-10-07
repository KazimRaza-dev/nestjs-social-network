import * as Joi from "joi";

enum validUsers {
    user = 'user',
    moderator = 'moderator'
}
export const loginUserSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().required().valid(...Object.values(validUsers)),
})