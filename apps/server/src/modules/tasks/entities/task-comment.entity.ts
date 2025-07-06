import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import { BaseEntity } from 'src/shared/base.entity';

@Schema({ timestamps: true })
export class TaskComment extends BaseEntity {
  @Prop({ required: true, trim: true })
  @ApiProperty()
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'Task', required: true })
  @ApiProperty()
  taskId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'TaskComment' })
  @ApiProperty()
  parentId?: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  @ApiProperty()
  mentions: Types.ObjectId[];

  @Prop({ default: false })
  @ApiProperty()
  isEdited: boolean;

  @Prop()
  @ApiProperty()
  editedAt?: Date;

  @Prop({ type: Object })
  @ApiProperty()
  metadata?: Record<string, any>;
}

export type TaskCommentDocument = HydratedDocument<TaskComment>;
export const TaskCommentSchema = SchemaFactory.createForClass(TaskComment);

// Add indexes for better query performance
TaskCommentSchema.index({ taskId: 1 });
TaskCommentSchema.index({ parentId: 1 });
TaskCommentSchema.index({ createdBy: 1 });
TaskCommentSchema.index({ createdAt: -1 });
TaskCommentSchema.index({ content: 'text' });