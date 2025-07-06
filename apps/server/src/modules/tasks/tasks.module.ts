import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task, TaskSchema } from './entities/task.entity';
import { UsersModule } from '../users/users.module';
import { ProjectsModule } from '../projects/projects.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    UsersModule,
    ProjectsModule,
    EventsModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
