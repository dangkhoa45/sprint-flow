import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import { BaseEntity } from 'src/shared/base.entity';

export enum AutomationTrigger {
  TASK_CREATED = 'task_created',
  TASK_UPDATED = 'task_updated',
  STATUS_CHANGED = 'status_changed',
  ASSIGNED = 'assigned',
  DUE_DATE_APPROACHING = 'due_date_approaching',
  OVERDUE = 'overdue',
  DEPENDENCY_COMPLETED = 'dependency_completed',
}

export enum AutomationAction {
  ASSIGN_USER = 'assign_user',
  CHANGE_STATUS = 'change_status',
  CHANGE_PRIORITY = 'change_priority',
  ADD_COMMENT = 'add_comment',
  SEND_NOTIFICATION = 'send_notification',
  ADD_TAG = 'add_tag',
  SET_DUE_DATE = 'set_due_date',
}

@Schema({ timestamps: true })
export class TaskAutomationRule extends BaseEntity {
  @Prop({ required: true, trim: true })
  @ApiProperty()
  name: string;

  @Prop({ trim: true })
  @ApiProperty()
  description?: string;

  @Prop({ type: String, enum: AutomationTrigger, required: true })
  @ApiProperty({ enum: AutomationTrigger })
  trigger: AutomationTrigger;

  @Prop({ type: Object })
  @ApiProperty()
  triggerConditions: Record<string, any>;

  @Prop({ type: String, enum: AutomationAction, required: true })
  @ApiProperty({ enum: AutomationAction })
  action: AutomationAction;

  @Prop({ type: Object })
  @ApiProperty()
  actionParams: Record<string, any>;

  @Prop({ type: Types.ObjectId, ref: 'Project' })
  @ApiProperty()
  projectId?: Types.ObjectId;

  @Prop({ default: true })
  @ApiProperty()
  isActive: boolean;

  @Prop({ default: 0 })
  @ApiProperty()
  executionCount: number;

  @Prop()
  @ApiProperty()
  lastExecutedAt?: Date;

  @Prop({ type: Object })
  @ApiProperty()
  metadata?: Record<string, any>;
}

export type TaskAutomationRuleDocument = HydratedDocument<TaskAutomationRule>;
export const TaskAutomationRuleSchema = SchemaFactory.createForClass(TaskAutomationRule);

// Add indexes for better query performance
TaskAutomationRuleSchema.index({ projectId: 1 });
TaskAutomationRuleSchema.index({ trigger: 1 });
TaskAutomationRuleSchema.index({ isActive: 1 });
TaskAutomationRuleSchema.index({ createdBy: 1 });
TaskAutomationRuleSchema.index({ createdAt: -1 });