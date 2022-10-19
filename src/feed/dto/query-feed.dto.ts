import { IsIn } from "class-validator";

const validSort = ['createdAt', 'title', 'description']
const validOrder = ['asc', 'desc']

export class FeedQuery {
    pageNo: string;
    size: string;

    @IsIn(validSort)
    sortBy: string

    @IsIn(validOrder)
    order: string;
}