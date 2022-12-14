import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from 'mongoose';
import { User } from "src/user/schema/user.schema";

export type PostDocument = SocialPost & Document;

@Schema({ timestamps: true })
export class SocialPost {

    @Prop({ required: true, type: String })
    title: string;

    @Prop({ required: true, type: String })
    description: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    userId: User;

    @Prop({ required: true, type: [String] })
    likes: string[];

    @Prop({ required: true, type: [String] })
    dislikes: string[];
}

export const PostSchema = SchemaFactory.createForClass(SocialPost);