import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task, TaskSchema } from './entities/task.entity';
import { TaskTemplate, TaskTemplateSchema } from './entities/task-template.entity';
import { TaskComment, TaskCommentSchema } from './entities/task-comment.entity';
import { TimeEntry, TimeEntrySchema } from './entities/time-entry.entity';
import { TaskAutomationRule, TaskAutomationRuleSchema } from './entities/task-automation-rule.entity';
import { Attachment, AttachmentSchema } from '../projects/entities/attachment.entity';
import { TaskTemplateService } from './task-template.service';
import { UsersModule } from '../users/users.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: TaskTemplate.name, schema: TaskTemplateSchema },
      { name: TaskComment.name, schema: TaskCommentSchema },
      { name: TimeEntry.name, schema: TimeEntrySchema },
      { name: TaskAutomationRule.name, schema: TaskAutomationRuleSchema },
      { name: Attachment.name, schema: AttachmentSchema },
    ]),
    UsersModule,
    ProjectsModule,
  ],
  controllers: [TasksController],
  providers: [TasksService, TaskTemplateService],
  exports: [TasksService, TaskTemplateService],
})
export class TasksModule {}
