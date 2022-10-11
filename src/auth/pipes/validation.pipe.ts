import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
    constructor(private schema: ObjectSchema) { }

    transform(value: any, metadata: ArgumentMetadata) {
        /**
         * Validate request object by comparing it with its respective Joi schema,
         * If validation failed then returns a error message
         */
        const { error } = this.schema.validate(value);
        if (error) {
            throw new BadRequestException(error.message);
        }
        return value;
    }
}
