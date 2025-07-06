import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    private usersService: UsersService,
    private projectsService: ProjectsService,
    private eventsGateway: EventsGateway,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    // Verify project exists and user has access
    const project = await this.projectsService.findById(
      createTaskDto.projectId,
    );
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Check if user is project member or owner
    const isOwner = project.owner.toString() === userId;
    const isMember = project.members.some(
      (member: any) => member.toString() === userId,
    );

    if (!isOwner && !isMember) {
      throw new ForbiddenException(
        'You do not have permission to create tasks in this project',
      );
    }

    // Verify assigned user exists and is project member (if assigned)
    if (createTaskDto.assignedTo) {
      const assignedUser = await this.usersService.findById(
        createTaskDto.assignedTo,
      );
      if (!assignedUser) {
        throw new NotFoundException('Assigned user not found');
      }

      const isAssignedUserMember = project.members.some(
        (member: any) => member.toString() === createTaskDto.assignedTo,
      );
      if (!isOwner && !isAssignedUserMember) {
        throw new ForbiddenException(
          'Assigned user is not a member of this project',
        );
      }
    }

    const task = new this.taskModel({
      ...createTaskDto,
      createdBy: new Types.ObjectId(userId),
      projectId: new Types.ObjectId(createTaskDto.projectId),
      assignedTo: createTaskDto.assignedTo
        ? new Types.ObjectId(createTaskDto.assignedTo)
        : undefined,
      dueDate: createTaskDto.dueDate
        ? new Date(createTaskDto.dueDate)
        : undefined,
    });

    const savedTask = await task.save();
    
    // Emit real-time event for task creation
    this.eventsGateway.emitTaskUpdate(createTaskDto.projectId, {
      taskId: savedTask._id.toString(),
      projectId: createTaskDto.projectId,
      type: 'task-created',
      data: { task: savedTask },
      timestamp: new Date(),
    });

    // Emit notification if task is assigned to someone
    if (createTaskDto.assignedTo) {
      this.eventsGateway.emitTaskAssigned(
        createTaskDto.assignedTo,
        savedTask._id.toString(),
        createTaskDto.projectId,
      );
    }

    return savedTask;
  }

  async findAll(
    query: TaskQueryDto,
    userId: string,
  ): Promise<{ data: Task[]; total: number; page: number; limit: number }> {
    const filter: any = {};

    // Build filter based on query parameters
    if (query.search) {
      filter.$text = { $search: query.search };
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.priority) {
      filter.priority = query.priority;
    }

    if (query.projectId) {
      filter.projectId = new Types.ObjectId(query.projectId);
    }

    if (query.assignedTo) {
      filter.assignedTo = new Types.ObjectId(query.assignedTo);
    }

    if (query.createdBy) {
      filter.createdBy = new Types.ObjectId(query.createdBy);
    }

    if (query.dueDateFrom || query.dueDateTo) {
      filter.dueDate = {};
      if (query.dueDateFrom) {
        filter.dueDate.$gte = new Date(query.dueDateFrom);
      }
      if (query.dueDateTo) {
        filter.dueDate.$lte = new Date(query.dueDateTo);
      }
    }

    // If no specific filters, show tasks from projects user has access to
    if (!query.projectId && !query.assignedTo && !query.createdBy) {
      // Get user's projects using existing method
      const userProjectsQuery = { member: userId, limit: 1000 };
      const userProjectsResult = await this.projectsService.findAllWithQuery(
        userProjectsQuery,
        userId,
      );
      const projectIds = userProjectsResult.data.map(
        (project: any) => project._id,
      );
      filter.projectId = { $in: projectIds };
    }

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const sort: any = {};
    sort[query.sortBy || 'createdAt'] = query.sortOrder === 'asc' ? 1 : -1;

    const [data, total] = await Promise.all([
      this.taskModel
        .find(filter)
        .populate('assignedTo', 'username displayName avatar')
        .populate('createdBy', 'username displayName avatar')
        .populate('projectId', 'name status')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.taskModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findById(id: string, userId: string): Promise<Task> {
    const task = await this.taskModel
      .findById(id)
      .populate('assignedTo', 'username displayName avatar')
      .populate('createdBy', 'username displayName avatar')
      .populate('projectId', 'name status owner members')
      .exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Check if user has access to this task
    const project = task.projectId as any;
    const isOwner = project.owner.toString() === userId;
    const isMember = project.members.some(
      (member: any) => member.toString() === userId,
    );
    const isAssigned =
      task.assignedTo && (task.assignedTo as any)._id.toString() === userId;
    const isCreator =
      task.createdBy && (task.createdBy as any)._id.toString() === userId;

    if (!isOwner && !isMember && !isAssigned && !isCreator) {
      throw new ForbiddenException(
        'You do not have permission to view this task',
      );
    }

    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    const task = await this.findById(id, userId);

    // Check if user has permission to update this task
    const project = task.projectId as any;
    const isOwner = project.owner.toString() === userId;
    const isAssigned =
      task.assignedTo && (task.assignedTo as any)._id.toString() === userId;
    const isCreator =
      task.createdBy && (task.createdBy as any)._id.toString() === userId;

    if (!isOwner && !isAssigned && !isCreator) {
      throw new ForbiddenException(
        'You do not have permission to update this task',
      );
    }

    // Verify assigned user exists and is project member (if changing assignment)
    if (
      updateTaskDto.assignedTo &&
      updateTaskDto.assignedTo !== (task.assignedTo as any)?._id?.toString()
    ) {
      const assignedUser = await this.usersService.findById(
        updateTaskDto.assignedTo,
      );
      if (!assignedUser) {
        throw new NotFoundException('Assigned user not found');
      }

      const isAssignedUserMember = project.members.some(
        (member: any) => member.toString() === updateTaskDto.assignedTo,
      );
      if (!isOwner && !isAssignedUserMember) {
        throw new ForbiddenException(
          'Assigned user is not a member of this project',
        );
      }
    }

    const updateData: any = {
      ...updateTaskDto,
      updatedBy: new Types.ObjectId(userId),
    };

    if (updateTaskDto.assignedTo) {
      updateData.assignedTo = new Types.ObjectId(updateTaskDto.assignedTo);
    }

    if (updateTaskDto.dueDate) {
      updateData.dueDate = new Date(updateTaskDto.dueDate);
    }

    const updatedTask = await this.taskModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('assignedTo', 'username displayName avatar')
      .populate('createdBy', 'username displayName avatar')
      .populate('projectId', 'name status')
      .exec();

    // Emit real-time event for task update
    const projectId = (task.projectId as any)._id.toString();
    this.eventsGateway.emitTaskUpdate(projectId, {
      taskId: id,
      projectId,
      type: 'task-updated',
      data: { task: updatedTask, changes: updateTaskDto },
      timestamp: new Date(),
    });

    // Emit status change event if status was changed
    if (updateTaskDto.status && updateTaskDto.status !== task.status) {
      this.eventsGateway.emitTaskStatusChanged(
        projectId,
        id,
        updateTaskDto.status,
        userId,
      );
    }

    // Emit notification if task is newly assigned
    if (
      updateTaskDto.assignedTo &&
      updateTaskDto.assignedTo !== (task.assignedTo as any)?._id?.toString()
    ) {
      this.eventsGateway.emitTaskAssigned(
        updateTaskDto.assignedTo,
        id,
        projectId,
      );
    }

    return updatedTask;
  }

  async remove(id: string, userId: string): Promise<void> {
    const task = await this.findById(id, userId);

    // Only project owner or task creator can delete task
    const project = task.projectId as any;
    const isOwner = project.owner.toString() === userId;
    const isCreator =
      task.createdBy && (task.createdBy as any)._id.toString() === userId;

    if (!isOwner && !isCreator) {
      throw new ForbiddenException(
        'You do not have permission to delete this task',
      );
    }

    await this.taskModel.findByIdAndDelete(id).exec();
  }

  async findProjectTasks(projectId: string, userId: string): Promise<Task[]> {
    // Verify user has access to project
    const project = await this.projectsService.findById(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const isOwner = project.owner.toString() === userId;
    const isMember = project.members.some(
      (member: any) => member.toString() === userId,
    );

    if (!isOwner && !isMember) {
      throw new ForbiddenException(
        'You do not have permission to view tasks in this project',
      );
    }

    return this.taskModel
      .find({ projectId: new Types.ObjectId(projectId) })
      .populate('assignedTo', 'username displayName avatar')
      .populate('createdBy', 'username displayName avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findUserTasks(userId: string, status?: string): Promise<Task[]> {
    const filter: any = {
      $or: [
        { assignedTo: new Types.ObjectId(userId) },
        { createdBy: new Types.ObjectId(userId) },
      ],
    };

    if (status) {
      filter.status = status;
    }

    return this.taskModel
      .find(filter)
      .populate('assignedTo', 'username displayName avatar')
      .populate('createdBy', 'username displayName avatar')
      .populate('projectId', 'name status')
      .sort({ dueDate: 1, createdAt: -1 })
      .exec();
  }

  async getTaskStats(userId: string): Promise<any> {
    // Get user's projects using existing method
    const userProjectsQuery = { member: userId, limit: 1000 };
    const userProjectsResult = await this.projectsService.findAllWithQuery(
      userProjectsQuery,
      userId,
    );
    const projectIds = userProjectsResult.data.map(
      (project: any) => project._id,
    );

    const stats = await this.taskModel.aggregate([
      {
        $match: {
          projectId: { $in: projectIds },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const totalTasks = await this.taskModel.countDocuments({
      projectId: { $in: projectIds },
    });

    const overdueTasks = await this.taskModel.countDocuments({
      projectId: { $in: projectIds },
      dueDate: { $lt: new Date() },
      status: { $nin: ['DONE', 'CANCELLED'] },
    });

    const statsMap = stats.reduce((acc: any, stat: any) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    return {
      total: totalTasks,
      overdue: overdueTasks,
      byStatus: {
        TODO: statsMap.TODO || 0,
        IN_PROGRESS: statsMap.IN_PROGRESS || 0,
        REVIEW: statsMap.REVIEW || 0,
        DONE: statsMap.DONE || 0,
        CANCELLED: statsMap.CANCELLED || 0,
      },
    };
  }
}
