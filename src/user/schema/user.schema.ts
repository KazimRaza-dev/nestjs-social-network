import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ unique: true, required: true, type: String })
    email: string;

    @Prop({ required: true, type: String })
    password: string;

    @Prop({ required: true, type: String })
    fname: string;

    @Prop({ required: true, type: String })
    lname: string;

    @Prop({ required: true, type: String })
    phoneNo: string;

    @Prop({ required: true, type: String, enum: ["user", "moderator"] })
    role: string;

    @Prop({ required: true, type: [String], default: [] })
    following: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);