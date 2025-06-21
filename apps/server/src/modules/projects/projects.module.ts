import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project, ProjectSchema } from './entities/project.entity';
import { Milestone, MilestoneSchema } from './entities/milestone.entity';
import { TimelineEvent, TimelineEventSchema } from './entities/timeline.entity';
import { Attachment, AttachmentSchema } from './entities/attachment.entity';
import { MilestonesService } from './milestones.service';
import { MilestonesController } from './milestones.controller';
import { AttachmentsService } from './attachments.service';
import { AttachmentsController } from './attachments.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: Milestone.name, schema: MilestoneSchema },
      { name: TimelineEvent.name, schema: TimelineEventSchema },
      { name: Attachment.name, schema: AttachmentSchema },
    ]),
    UsersModule,
  ],
  controllers: [ProjectsController, MilestonesController, AttachmentsController],
  providers: [ProjectsService, MilestonesService, AttachmentsService],
  exports: [ProjectsService, MilestonesService, AttachmentsService],
})
export class ProjectsModule {}
