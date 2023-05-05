import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MSchema } from 'mongoose';
import { Track } from './track.schema';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop()
  username: string;

  @Prop()
  text: string;

  @Prop({ type: { type: MSchema.Types.ObjectId, ref: 'Track' } })
  trackId: Track;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
