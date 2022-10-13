import * as Joi from "joi";

enum validSort {
    createdAt = 'createdAt',
    title = 'title',
    description = 'description',
}
enum validOrder {
    asc = 'asc',
    desc = 'desc'
}
/**
 * The purpose of this schema is to validate query string parameters. None of the parameter
 * is required. If user does not provide a specific query string paramater then its default value
 * will use to sort the records.
 */
export const feedSchema = Joi.object({
    pageNo: Joi.string(),       // If the user wants to provide page Number or number of records per page for pagination 
    size: Joi.string(),         // then name of these paramters should be 'pageNo' and 'size'
    sortBy: Joi.string().valid(...Object.values(validSort)),   // If user wants to sort the records by specific field, then the name of the field
    // can be title, description, Id or createAt.
    order: Joi.string().valid(...Object.values(validOrder)),  //Similarly the order of sort can be either 'asc' or 'desc'
});
