import * as Joi from "joi";

export const createPostSchema = Joi.object({
    title: Joi.string().min(5).max(15),
    description: Joi.string().min(5).max(100),
});