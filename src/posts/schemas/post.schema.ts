import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Post extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: 'draft' })
  status: 'draft' | 'published';

  @Prop({ type: 'ObjectId', ref: 'User' })
  author: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);