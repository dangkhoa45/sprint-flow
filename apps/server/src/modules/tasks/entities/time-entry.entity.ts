import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import { BaseEntity } from 'src/shared/base.entity';

export enum TimeEntryType {
  MANUAL = 'manual',
  TIMER = 'timer',
  IMPORTED = 'imported',
}

@Schema({ timestamps: true })
export class TimeEntry extends BaseEntity {
  @Prop({ required: true, min: 0 })
  @ApiProperty()
  duration: number; // in minutes

  @Prop({ required: true })
  @ApiProperty()
  startTime: Date;

  @Prop()
  @ApiProperty()
  endTime?: Date;

  @Prop({ trim: true })
  @ApiProperty()
  description?: string;

  @Prop({ type: String, enum: TimeEntryType, default: TimeEntryType.MANUAL })
  @ApiProperty({ enum: TimeEntryType })
  type: TimeEntryType;

  @Prop({ type: Types.ObjectId, ref: 'Task', required: true })
  @ApiProperty()
  taskId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @ApiProperty()
  userId: Types.ObjectId;

  @Prop({ default: false })
  @ApiProperty()
  isBillable: boolean;

  @Prop({ min: 0 })
  @ApiProperty()
  hourlyRate?: number;

  @Prop({ type: [String], default: [] })
  @ApiProperty()
  tags: string[];

  @Prop({ type: Object })
  @ApiProperty()
  metadata?: Record<string, any>;
}

export type TimeEntryDocument = HydratedDocument<TimeEntry>;
export const TimeEntrySchema = SchemaFactory.createForClass(TimeEntry);

// Add indexes for better query performance
TimeEntrySchema.index({ taskId: 1 });
TimeEntrySchema.index({ userId: 1 });
TimeEntrySchema.index({ startTime: 1 });
TimeEntrySchema.index({ createdAt: -1 });
TimeEntrySchema.index({ type: 1 });
TimeEntrySchema.index({ isBillable: 1 });