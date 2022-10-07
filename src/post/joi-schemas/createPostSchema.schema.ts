import * as Joi from "joi";

export const createPostSchema = Joi.object({
    title: Joi.string().min(5).max(15).required(),
    description: Joi.string().min(5).max(100).required(),
});