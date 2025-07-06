import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TaskTemplate, TaskTemplateDocument } from './entities/task-template.entity';
import { CreateTaskTemplateDto } from './dto/create-task-template.dto';
import { UpdateTaskTemplateDto } from './dto/update-task-template.dto';
import { TaskTemplateQueryDto } from './dto/task-template-query.dto';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class TaskTemplateService {
  constructor(
    @InjectModel(TaskTemplate.name)
    private taskTemplateModel: Model<TaskTemplateDocument>,
    private projectsService: ProjectsService,
  ) {}

  async createTemplate(
    createTaskTemplateDto: CreateTaskTemplateDto,
    userId: string,
  ): Promise<TaskTemplate> {
    // Verify project exists and user has access (if projectId is provided)
    if (createTaskTemplateDto.projectId) {
      const project = await this.projectsService.findById(
        createTaskTemplateDto.projectId,
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
          'You do not have permission to create templates for this project',
        );
      }
    }

    const template = new this.taskTemplateModel({
      ...createTaskTemplateDto,
      createdBy: new Types.ObjectId(userId),
      projectId: createTaskTemplateDto.projectId
        ? new Types.ObjectId(createTaskTemplateDto.projectId)
        : undefined,
    });

    return template.save();
  }

  async findAllTemplates(
    query: TaskTemplateQueryDto,
    userId: string,
  ): Promise<{ data: TaskTemplate[]; total: number; page: number; limit: number }> {
    const filter: any = { isActive: true };

    // Build filter based on query parameters
    if (query.search) {
      filter.$text = { $search: query.search };
    }

    if (query.name) {
      filter.name = { $regex: query.name, $options: 'i' };
    }

    if (query.defaultPriority) {
      filter.defaultPriority = query.defaultPriority;
    }

    if (query.projectId) {
      filter.projectId = new Types.ObjectId(query.projectId);
    }

    if (query.isActive !== undefined) {
      filter.isActive = query.isActive;
    }

    if (query.createdBy) {
      filter.createdBy = new Types.ObjectId(query.createdBy);
    }

    // If no specific filters, show templates user has access to
    if (!query.projectId && !query.createdBy) {
      // Get user's projects
      const userProjectsQuery = { member: userId, limit: 1000 };
      const userProjectsResult = await this.projectsService.findAllWithQuery(
        userProjectsQuery,
        userId,
      );
      const projectIds = userProjectsResult.data.map(
        (project: any) => project._id,
      );

      // Show global templates (no projectId) or templates from user's projects
      filter.$or = [
        { projectId: { $exists: false } },
        { projectId: null },
        { projectId: { $in: projectIds } },
        { createdBy: new Types.ObjectId(userId) },
      ];
    }

    const page = query.offset ? Math.floor(query.offset / (query.limit || 10)) + 1 : 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const sort: any = {};
    sort[query.sortField || 'createdAt'] = query.sortOrder === 'asc' ? 1 : -1;

    const [data, total] = await Promise.all([
      this.taskTemplateModel
        .find(filter)
        .populate('createdBy', 'username displayName avatar')
        .populate('projectId', 'name status')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.taskTemplateModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findTemplateById(id: string, userId: string): Promise<TaskTemplate> {
    const template = await this.taskTemplateModel
      .findById(id)
      .populate('createdBy', 'username displayName avatar')
      .populate('projectId', 'name status owner members')
      .exec();

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    // Check if user has access to this template
    const isCreator = template.createdBy && (template.createdBy as any)._id.toString() === userId;
    
    if (template.projectId) {
      const project = template.projectId as any;
      const isOwner = project.owner.toString() === userId;
      const isMember = project.members.some(
        (member: any) => member.toString() === userId,
      );

      if (!isOwner && !isMember && !isCreator) {
        throw new ForbiddenException(
          'You do not have permission to view this template',
        );
      }
    } else if (!isCreator) {
      // Global templates are accessible to everyone, but non-global templates need permission
      // Actually, for simplicity, let's allow global templates to be viewed by anyone
    }

    return template;
  }

  async updateTemplate(
    id: string,
    updateTaskTemplateDto: UpdateTaskTemplateDto,
    userId: string,
  ): Promise<TaskTemplate> {
    const template = await this.findTemplateById(id, userId);

    // Check if user has permission to update this template
    const isCreator = template.createdBy && (template.createdBy as any)._id.toString() === userId;
    
    if (template.projectId) {
      const project = template.projectId as any;
      const isOwner = project.owner.toString() === userId;

      if (!isOwner && !isCreator) {
        throw new ForbiddenException(
          'You do not have permission to update this template',
        );
      }
    } else if (!isCreator) {
      throw new ForbiddenException(
        'You do not have permission to update this template',
      );
    }

    const updateData: any = {
      ...updateTaskTemplateDto,
      updatedBy: new Types.ObjectId(userId),
    };

    const updatedTemplate = await this.taskTemplateModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('createdBy', 'username displayName avatar')
      .populate('projectId', 'name status')
      .exec();

    return updatedTemplate;
  }

  async deleteTemplate(id: string, userId: string): Promise<void> {
    const template = await this.findTemplateById(id, userId);

    // Check if user has permission to delete this template
    const isCreator = template.createdBy && (template.createdBy as any)._id.toString() === userId;
    
    if (template.projectId) {
      const project = template.projectId as any;
      const isOwner = project.owner.toString() === userId;

      if (!isOwner && !isCreator) {
        throw new ForbiddenException(
          'You do not have permission to delete this template',
        );
      }
    } else if (!isCreator) {
      throw new ForbiddenException(
        'You do not have permission to delete this template',
      );
    }

    await this.taskTemplateModel.findByIdAndDelete(id).exec();
  }

  async findProjectTemplates(projectId: string, userId: string): Promise<TaskTemplate[]> {
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
        'You do not have permission to view templates for this project',
      );
    }

    return this.taskTemplateModel
      .find({ 
        projectId: new Types.ObjectId(projectId),
        isActive: true 
      })
      .populate('createdBy', 'username displayName avatar')
      .sort({ createdAt: -1 })
      .exec();
  }
}