import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from './entities/task.entity';
import { TaskTemplate, TaskTemplateDocument } from './entities/task-template.entity';
import { TaskComment, TaskCommentDocument } from './entities/task-comment.entity';
import { TimeEntry, TimeEntryDocument } from './entities/time-entry.entity';
import { Attachment, AttachmentDocument } from '../projects/entities/attachment.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { CreateTaskFromTemplateDto, BulkUpdateTaskDto, BulkDeleteTaskDto } from './dto/bulk-operations.dto';
import { CreateTaskCommentDto, UpdateTaskCommentDto } from './dto/task-comment.dto';
import { CreateTimeEntryDto, UpdateTimeEntryDto } from './dto/time-entry.dto';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(TaskTemplate.name) private taskTemplateModel: Model<TaskTemplateDocument>,
    @InjectModel(TaskComment.name) private taskCommentModel: Model<TaskCommentDocument>,
    @InjectModel(TimeEntry.name) private timeEntryModel: Model<TimeEntryDocument>,
    @InjectModel(Attachment.name) private attachmentModel: Model<AttachmentDocument>,
    private usersService: UsersService,
    private projectsService: ProjectsService,
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

    // Validate dependencies
    if (createTaskDto.dependencies?.length) {
      await this.validateDependencies(createTaskDto.dependencies, createTaskDto.projectId);
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
      dependencies: createTaskDto.dependencies
        ? createTaskDto.dependencies.map(dep => new Types.ObjectId(dep))
        : [],
      dependents: [],
    });

    const savedTask = await task.save();

    // Update dependent tasks
    if (createTaskDto.dependencies?.length) {
      await this.updateDependents(createTaskDto.dependencies, savedTask._id.toString());
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
        .populate('dependencies', 'title status')
        .populate('dependents', 'title status')
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
      .populate('dependencies', 'title status')
      .populate('dependents', 'title status')
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

    // Validate dependencies if being updated
    if (updateTaskDto.dependencies) {
      await this.validateDependencies(updateTaskDto.dependencies, project._id.toString());
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

    if (updateTaskDto.dependencies) {
      updateData.dependencies = updateTaskDto.dependencies.map(dep => new Types.ObjectId(dep));
      
      // Remove this task from old dependencies' dependents
      const oldDependencies = task.dependencies || [];
      const oldDependencyIds = oldDependencies.map(dep => dep.toString());
      const newDependencyIds = updateTaskDto.dependencies;
      
      const removedDependencies = oldDependencyIds.filter(id => !newDependencyIds.includes(id));
      const addedDependencies = newDependencyIds.filter(id => !oldDependencyIds.includes(id));
      
      if (removedDependencies.length > 0) {
        await this.taskModel.updateMany(
          { _id: { $in: removedDependencies.map(id => new Types.ObjectId(id)) } },
          { $pull: { dependents: task._id } },
        );
      }
      
      if (addedDependencies.length > 0) {
        await this.taskModel.updateMany(
          { _id: { $in: addedDependencies.map(id => new Types.ObjectId(id)) } },
          { $addToSet: { dependents: task._id } },
        );
      }
    }

    const updatedTask = await this.taskModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('assignedTo', 'username displayName avatar')
      .populate('createdBy', 'username displayName avatar')
      .populate('projectId', 'name status')
      .exec();

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

    // Check if task has dependents
    if (task.dependents?.length > 0) {
      throw new BadRequestException(
        'Cannot delete task with dependent tasks. Delete dependent tasks first or use force delete.',
      );
    }

    // Remove from dependents of dependencies
    if (task.dependencies?.length > 0) {
      await this.taskModel.updateMany(
        { _id: { $in: task.dependencies } },
        { $pull: { dependents: task._id } },
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

  private async validateDependencies(dependencies: string[], projectId: string): Promise<void> {
    const dependencyTasks = await this.taskModel
      .find({
        _id: { $in: dependencies.map(dep => new Types.ObjectId(dep)) },
        projectId: new Types.ObjectId(projectId),
      })
      .exec();

    if (dependencyTasks.length !== dependencies.length) {
      throw new BadRequestException('Some dependency tasks not found or not in the same project');
    }
  }

  private async updateDependents(dependencies: string[], taskId: string): Promise<void> {
    await this.taskModel.updateMany(
      { _id: { $in: dependencies.map(dep => new Types.ObjectId(dep)) } },
      { $addToSet: { dependents: new Types.ObjectId(taskId) } }
    );
  }

  async createTaskFromTemplate(
    createTaskFromTemplateDto: CreateTaskFromTemplateDto,
    userId: string,
  ): Promise<Task> {
    const template = await this.taskTemplateModel.findById(createTaskFromTemplateDto.templateId);
    if (!template) {
      throw new NotFoundException('Template not found');
    }

    // Check if user has access to the template
    if (template.projectId) {
      const project = await this.projectsService.findById(template.projectId.toString());
      if (!project) {
        throw new NotFoundException('Template project not found');
      }

      const isOwner = project.owner.toString() === userId;
      const isMember = project.members.some(
        (member: any) => member.toString() === userId,
      );

      if (!isOwner && !isMember) {
        throw new ForbiddenException('You do not have permission to use this template');
      }
    }

    const createTaskDto: CreateTaskDto = {
      title: createTaskFromTemplateDto.title || template.taskTitle,
      description: createTaskFromTemplateDto.description || template.taskDescription,
      projectId: createTaskFromTemplateDto.projectId,
      priority: template.defaultPriority,
      estimatedTime: template.defaultEstimatedTime,
      tags: template.defaultTags,
      assignedTo: createTaskFromTemplateDto.assignedTo,
      dueDate: createTaskFromTemplateDto.dueDate,
    };

    return this.create(createTaskDto, userId);
  }

  async bulkUpdateTasks(
    bulkUpdateDto: BulkUpdateTaskDto,
    userId: string,
  ): Promise<{ updated: number; failed: string[] }> {
    const tasks = await this.taskModel
      .find({ _id: { $in: bulkUpdateDto.taskIds.map(id => new Types.ObjectId(id)) } })
      .populate('projectId', 'owner members')
      .exec();

    const validTaskIds: string[] = [];
    const failedTaskIds: string[] = [];

    // Check permissions for each task
    for (const task of tasks) {
      const project = task.projectId as any;
      const isOwner = project.owner.toString() === userId;
      const isMember = project.members.some(
        (member: any) => member.toString() === userId,
      );
      const isAssigned = task.assignedTo?.toString() === userId;
      const isCreator = task.createdBy?.toString() === userId;

      if (isOwner || isMember || isAssigned || isCreator) {
        validTaskIds.push(task._id.toString());
      } else {
        failedTaskIds.push(task._id.toString());
      }
    }

    const updateData: any = {
      updatedBy: new Types.ObjectId(userId),
    };

    if (bulkUpdateDto.status) {
      updateData.status = bulkUpdateDto.status;
    }

    if (bulkUpdateDto.priority) {
      updateData.priority = bulkUpdateDto.priority;
    }

    if (bulkUpdateDto.assignedTo) {
      updateData.assignedTo = new Types.ObjectId(bulkUpdateDto.assignedTo);
    }

    if (bulkUpdateDto.addTags?.length) {
      updateData.$addToSet = { tags: { $each: bulkUpdateDto.addTags } };
    }

    if (bulkUpdateDto.removeTags?.length) {
      updateData.$pull = { tags: { $in: bulkUpdateDto.removeTags } };
    }

    const result = await this.taskModel.updateMany(
      { _id: { $in: validTaskIds.map(id => new Types.ObjectId(id)) } },
      updateData,
    );

    return {
      updated: result.modifiedCount,
      failed: failedTaskIds,
    };
  }

  async bulkDeleteTasks(
    bulkDeleteDto: BulkDeleteTaskDto,
    userId: string,
  ): Promise<{ deleted: number; failed: string[] }> {
    const tasks = await this.taskModel
      .find({ _id: { $in: bulkDeleteDto.taskIds.map(id => new Types.ObjectId(id)) } })
      .populate('projectId', 'owner members')
      .exec();

    const validTaskIds: string[] = [];
    const failedTaskIds: string[] = [];

    // Check permissions and dependencies for each task
    for (const task of tasks) {
      const project = task.projectId as any;
      const isOwner = project.owner.toString() === userId;
      const isCreator = task.createdBy?.toString() === userId;

      if (!isOwner && !isCreator) {
        failedTaskIds.push(task._id.toString());
        continue;
      }

      // Check if task has dependents (unless force delete)
      if (!bulkDeleteDto.force && task.dependents?.length > 0) {
        failedTaskIds.push(task._id.toString());
        continue;
      }

      validTaskIds.push(task._id.toString());
    }

    // Remove from dependents of dependencies
    for (const taskId of validTaskIds) {
      const task = tasks.find(t => t._id.toString() === taskId);
      if (task?.dependencies?.length) {
        await this.taskModel.updateMany(
          { _id: { $in: task.dependencies } },
          { $pull: { dependents: new Types.ObjectId(taskId) } },
        );
      }
    }

    const result = await this.taskModel.deleteMany(
      { _id: { $in: validTaskIds.map(id => new Types.ObjectId(id)) } },
    );

    return {
      deleted: result.deletedCount,
      failed: failedTaskIds,
    };
  }

  // Task Comments
  async createComment(
    createCommentDto: CreateTaskCommentDto,
    userId: string,
  ): Promise<TaskComment> {
    // Verify user has access to the task
    const task = await this.findById(createCommentDto.taskId, userId);

    const comment = new this.taskCommentModel({
      ...createCommentDto,
      createdBy: new Types.ObjectId(userId),
      taskId: new Types.ObjectId(createCommentDto.taskId),
      parentId: createCommentDto.parentId
        ? new Types.ObjectId(createCommentDto.parentId)
        : undefined,
      mentions: createCommentDto.mentions
        ? createCommentDto.mentions.map(mention => new Types.ObjectId(mention))
        : [],
    });

    return comment.save();
  }

  async getTaskComments(taskId: string, userId: string): Promise<TaskComment[]> {
    // Verify user has access to the task
    await this.findById(taskId, userId);

    return this.taskCommentModel
      .find({ taskId: new Types.ObjectId(taskId) })
      .populate('createdBy', 'username displayName avatar')
      .populate('mentions', 'username displayName')
      .sort({ createdAt: 1 })
      .exec();
  }

  async updateComment(
    commentId: string,
    updateCommentDto: UpdateTaskCommentDto,
    userId: string,
  ): Promise<TaskComment> {
    const comment = await this.taskCommentModel.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Only comment creator can update
    if (comment.createdBy.toString() !== userId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    const updateData: any = {
      ...updateCommentDto,
      isEdited: true,
      editedAt: new Date(),
    };

    if (updateCommentDto.mentions) {
      updateData.mentions = updateCommentDto.mentions.map(mention => new Types.ObjectId(mention));
    }

    return this.taskCommentModel
      .findByIdAndUpdate(commentId, updateData, { new: true })
      .populate('createdBy', 'username displayName avatar')
      .populate('mentions', 'username displayName')
      .exec();
  }

  async deleteComment(commentId: string, userId: string): Promise<void> {
    const comment = await this.taskCommentModel.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Only comment creator can delete
    if (comment.createdBy.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.taskCommentModel.findByIdAndDelete(commentId);
  }

  // Time Entries
  async createTimeEntry(
    createTimeEntryDto: CreateTimeEntryDto,
    userId: string,
  ): Promise<TimeEntry> {
    // Verify user has access to the task
    const task = await this.findById(createTimeEntryDto.taskId, userId);

    const timeEntry = new this.timeEntryModel({
      ...createTimeEntryDto,
      createdBy: new Types.ObjectId(userId),
      userId: new Types.ObjectId(userId),
      taskId: new Types.ObjectId(createTimeEntryDto.taskId),
      startTime: new Date(createTimeEntryDto.startTime),
      endTime: createTimeEntryDto.endTime ? new Date(createTimeEntryDto.endTime) : undefined,
    });

    return timeEntry.save();
  }

  async getTaskTimeEntries(taskId: string, userId: string): Promise<TimeEntry[]> {
    // Verify user has access to the task
    await this.findById(taskId, userId);

    return this.timeEntryModel
      .find({ taskId: new Types.ObjectId(taskId) })
      .populate('userId', 'username displayName avatar')
      .sort({ startTime: -1 })
      .exec();
  }

  async updateTimeEntry(
    timeEntryId: string,
    updateTimeEntryDto: UpdateTimeEntryDto,
    userId: string,
  ): Promise<TimeEntry> {
    const timeEntry = await this.timeEntryModel.findById(timeEntryId);
    if (!timeEntry) {
      throw new NotFoundException('Time entry not found');
    }

    // Only time entry creator can update
    if (timeEntry.userId.toString() !== userId) {
      throw new ForbiddenException('You can only update your own time entries');
    }

    const updateData: any = { ...updateTimeEntryDto };

    if (updateTimeEntryDto.startTime) {
      updateData.startTime = new Date(updateTimeEntryDto.startTime);
    }

    if (updateTimeEntryDto.endTime) {
      updateData.endTime = new Date(updateTimeEntryDto.endTime);
    }

    return this.timeEntryModel
      .findByIdAndUpdate(timeEntryId, updateData, { new: true })
      .populate('userId', 'username displayName avatar')
      .exec();
  }

  async deleteTimeEntry(timeEntryId: string, userId: string): Promise<void> {
    const timeEntry = await this.timeEntryModel.findById(timeEntryId);
    if (!timeEntry) {
      throw new NotFoundException('Time entry not found');
    }

    // Only time entry creator can delete
    if (timeEntry.userId.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own time entries');
    }

    await this.timeEntryModel.findByIdAndDelete(timeEntryId);
  }

  async getTimeTrackingStats(taskId: string, userId: string): Promise<any> {
    // Verify user has access to the task
    await this.findById(taskId, userId);

    const stats = await this.timeEntryModel.aggregate([
      { $match: { taskId: new Types.ObjectId(taskId) } },
      {
        $group: {
          _id: '$userId',
          totalDuration: { $sum: '$duration' },
          entryCount: { $sum: 1 },
          billableTime: {
            $sum: {
              $cond: [{ $eq: ['$isBillable', true] }, '$duration', 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          userId: '$_id',
          username: '$user.username',
          displayName: '$user.displayName',
          totalDuration: 1,
          entryCount: 1,
          billableTime: 1,
        },
      },
    ]);

    const totalStats = await this.timeEntryModel.aggregate([
      { $match: { taskId: new Types.ObjectId(taskId) } },
      {
        $group: {
          _id: null,
          totalDuration: { $sum: '$duration' },
          totalEntries: { $sum: 1 },
          totalBillableTime: {
            $sum: {
              $cond: [{ $eq: ['$isBillable', true] }, '$duration', 0],
            },
          },
        },
      },
    ]);

    return {
      byUser: stats,
      totals: totalStats[0] || {
        totalDuration: 0,
        totalEntries: 0,
        totalBillableTime: 0,
      },
    };
  }

  // Task Attachments
  async getTaskAttachments(taskId: string, userId: string): Promise<Attachment[]> {
    // Verify user has access to the task
    await this.findById(taskId, userId);

    return this.attachmentModel
      .find({ taskId: new Types.ObjectId(taskId) })
      .populate('uploadedBy', 'username displayName avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  async uploadTaskAttachment(
    file: Express.Multer.File,
    taskId: string,
    userId: string,
    description?: string,
    tags?: string[],
  ): Promise<Attachment> {
    // Verify user has access to the task
    const task = await this.findById(taskId, userId);

    const attachmentData = {
      filename: `${Date.now()}-${file.originalname}`,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      type: this.getFileType(file.mimetype),
      taskId: new Types.ObjectId(taskId),
      description,
      tags: tags || [],
      uploadedBy: new Types.ObjectId(userId),
      createdBy: new Types.ObjectId(userId),
    };

    return this.attachmentModel.create(attachmentData);
  }

  async deleteTaskAttachment(attachmentId: string, userId: string): Promise<void> {
    const attachment = await this.attachmentModel.findById(attachmentId);
    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }

    if (!attachment.taskId) {
      throw new BadRequestException('Attachment is not associated with a task');
    }

    // Verify user has access to the task
    await this.findById(attachment.taskId.toString(), userId);

    // Only uploader or task owner can delete
    const task = await this.findById(attachment.taskId.toString(), userId);
    const project = task.projectId as any;
    const isProjectOwner = project.owner.toString() === userId;
    const isUploader = attachment.uploadedBy.toString() === userId;

    if (!isProjectOwner && !isUploader) {
      throw new ForbiddenException('You can only delete your own attachments or you must be the project owner');
    }

    await this.attachmentModel.findByIdAndDelete(attachmentId);
  }

  private getFileType(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text/')) return 'document';
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('archive')) return 'archive';
    return 'other';
  }
}
