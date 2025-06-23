import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { BaseService } from 'src/shared/base.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { MilestoneQueryDto } from './dto/milestone-query.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { Milestone } from './entities/milestone.entity';
import { Project } from './entities/project.entity';
import { TimelineEvent, TimelineEventType } from './entities/timeline.entity';

@Injectable()
export class MilestonesService extends BaseService<
  Milestone,
  CreateMilestoneDto,
  UpdateMilestoneDto
> {
  constructor(
    @InjectModel(Milestone.name)
    private readonly milestoneModel: Model<Milestone>,
    @InjectModel(Project.name)
    private readonly projectModel: Model<Project>,
    @InjectModel(TimelineEvent.name)
    private readonly timelineEventModel: Model<TimelineEvent>,
  ) {
    super(milestoneModel);
  }

  async createMilestone(
    input: CreateMilestoneDto,
    projectId: string,
    userId: string,
  ): Promise<Milestone> {
    // Check if project exists and user has access
    const project = await this.projectModel.findById(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (
      project.owner.toString() !== userId &&
      !project.members.includes(new Types.ObjectId(userId))
    ) {
      throw new ForbiddenException('Access denied to this project');
    }

    const milestoneData = {
      ...input,
      projectId: new Types.ObjectId(projectId),
      createdBy: new Types.ObjectId(userId),
      assignedTo: input.assignedTo
        ? new Types.ObjectId(input.assignedTo)
        : undefined,
      dueDate: new Date(input.dueDate),
    };

    const milestone = await super.create(milestoneData as any);

    // Create timeline event
    await this.createTimelineEvent({
      type: TimelineEventType.MILESTONE_REACHED,
      title: `Milestone created: ${milestone.title}`,
      description: `New milestone "${milestone.title}" was created`,
      projectId: new Types.ObjectId(projectId),
      userId: new Types.ObjectId(userId),
      milestoneId: milestone._id,
    });

    return milestone;
  }

  async findAllWithQuery(query: MilestoneQueryDto, userId: string) {
    const filter: FilterQuery<Milestone> = {};

    // Search functionality
    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
      ];
    }

    // Status filter
    if (query.status) {
      filter.status = query.status;
    }

    // Project filter
    if (query.projectId) {
      filter.projectId = new Types.ObjectId(query.projectId);
    }

    // Assigned to filter
    if (query.assignedTo) {
      filter.assignedTo = new Types.ObjectId(query.assignedTo);
    }

    // Date range filters
    if (query.dueDateFrom || query.dueDateTo) {
      filter.dueDate = {};
      if (query.dueDateFrom) {
        filter.dueDate.$gte = new Date(query.dueDateFrom);
      }
      if (query.dueDateTo) {
        filter.dueDate.$lte = new Date(query.dueDateTo);
      }
    }

    // User access control - only show milestones from projects where user is owner or member
    if (!query.projectId) {
      const userProjects = await this.projectModel
        .find({
          $or: [
            { owner: new Types.ObjectId(userId) },
            { members: { $in: [new Types.ObjectId(userId)] } },
          ],
        })
        .select('_id');

      filter.projectId = { $in: userProjects.map(p => p._id) };
    }

    const milestones = await this.findAll({
      ...filter,
      offset: query.offset,
      limit: query.limit,
      sortField: query.sortField as never,
      sortOrder: query.sortOrder,
      populate: ['assignedTo', 'createdBy', 'updatedBy'],
    });

    const total = await this.countAll(filter);

    return {
      data: milestones,
      total,
      page: Math.floor((query.offset || 0) / (query.limit || 10)) + 1,
      limit: query.limit || 10,
    };
  }

  async updateWithAccess(
    id: string,
    input: UpdateMilestoneDto,
    userId: string,
  ): Promise<Milestone> {
    const milestone = await this.findById(id, ['projectId']);
    if (!milestone) {
      throw new NotFoundException('Milestone not found');
    }

    // Check project access
    const project = await this.projectModel.findById(milestone.projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (
      project.owner.toString() !== userId &&
      !project.members.includes(new Types.ObjectId(userId))
    ) {
      throw new ForbiddenException('Access denied to this milestone');
    }

    const updateData: any = {
      ...input,
      updatedBy: new Types.ObjectId(userId),
    };

    if (input.assignedTo) {
      updateData.assignedTo = new Types.ObjectId(input.assignedTo);
    }

    if (input.dueDate) {
      updateData.dueDate = new Date(input.dueDate);
    }

    const updatedMilestone = await super.update(id, updateData);

    // Create timeline event for milestone update
    await this.createTimelineEvent({
      type: TimelineEventType.MILESTONE_REACHED,
      title: `Milestone updated: ${updatedMilestone.title}`,
      description: `Milestone "${updatedMilestone.title}" was updated`,
      projectId: new Types.ObjectId(project._id.toString()),
      userId: new Types.ObjectId(userId),
      milestoneId: updatedMilestone._id,
    });

    return updatedMilestone;
  }

  async deleteWithAccess(id: string, userId: string): Promise<void> {
    const milestone = await this.findById(id, ['projectId', 'title']);
    if (!milestone) {
      throw new NotFoundException('Milestone not found');
    }

    // Check project access
    const project = await this.projectModel.findById(milestone.projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (
      project.owner.toString() !== userId &&
      !project.members.includes(new Types.ObjectId(userId))
    ) {
      throw new ForbiddenException('Access denied to this milestone');
    }

    await super.remove(id);

    // Create timeline event for milestone deletion
    await this.createTimelineEvent({
      type: TimelineEventType.MILESTONE_REACHED,
      title: `Milestone deleted: ${milestone.title}`,
      description: `Milestone "${milestone.title}" was deleted`,
      projectId: new Types.ObjectId(project._id.toString()),
      userId: new Types.ObjectId(userId),
    });
  }

  private async createTimelineEvent(eventData: {
    type: TimelineEventType;
    title: string;
    description: string;
    projectId: Types.ObjectId;
    userId: Types.ObjectId;
    milestoneId?: Types.ObjectId;
  }) {
    await this.timelineEventModel.create({
      ...eventData,
      createdBy: eventData.userId,
    });
  }
}
