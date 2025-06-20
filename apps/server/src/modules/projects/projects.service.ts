import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { BaseService } from 'src/shared/base.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectQueryDto, ProjectStatsDto } from './dto/project-query.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, ProjectStatus } from './entities/project.entity';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class ProjectsService extends BaseService<
  Project,
  CreateProjectDto,
  UpdateProjectDto
> {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<Project>,
  ) {
    super(projectModel);
  }

  async createProject(
    input: CreateProjectDto,
    userId: string,
  ): Promise<Project> {
    const projectData = {
      ...input,
      owner: new Types.ObjectId(userId),
      createdBy: new Types.ObjectId(userId),
      members: input.members?.map(id => new Types.ObjectId(id)) || [],
    };

    return super.create(projectData as any);
  }

  async findAllWithQuery(query: ProjectQueryDto, userId: string) {
    const filter: FilterQuery<Project> = {};

    // Search functionality
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
      ];
    }

    // Status filter
    if (query.status) {
      filter.status = query.status;
    }

    // Priority filter
    if (query.priority) {
      filter.priority = query.priority;
    }

    // Owner filter
    if (query.owner) {
      filter.owner = new Types.ObjectId(query.owner);
    }

    // Member filter
    if (query.member) {
      filter.$or = [
        { owner: new Types.ObjectId(query.member) },
        { members: { $in: [new Types.ObjectId(query.member)] } },
      ];
    }

    // Date range filters
    if (query.startDateFrom || query.startDateTo) {
      filter.startDate = {};
      if (query.startDateFrom) {
        filter.startDate.$gte = new Date(query.startDateFrom);
      }
      if (query.startDateTo) {
        filter.startDate.$lte = new Date(query.startDateTo);
      }
    }

    if (query.endDateFrom || query.endDateTo) {
      filter.endDate = {};
      if (query.endDateFrom) {
        filter.endDate.$gte = new Date(query.endDateFrom);
      }
      if (query.endDateTo) {
        filter.endDate.$lte = new Date(query.endDateTo);
      }
    }

    // Tags filter
    if (query.tags && query.tags.length > 0) {
      filter.tags = { $in: query.tags };
    }

    // User access control - only show projects where user is owner or member
    filter.$or = [
      { owner: new Types.ObjectId(userId) },
      { members: { $in: [new Types.ObjectId(userId)] } },
    ];

    const projects = await this.findAll({
      ...filter,
      offset: query.offset,
      limit: query.limit,
      sortField: query.sortField as never,
      sortOrder: query.sortOrder,
      populate: ['owner', 'members', 'createdBy', 'updatedBy'],
    });

    const total = await this.countAll(filter);

    return {
      data: projects,
      total,
      page: Math.floor((query.offset || 0) / (query.limit || 10)) + 1,
      limit: query.limit || 10,
    };
  }

  async findAllForAdmin(query: ProjectQueryDto) {
    const filter: FilterQuery<Project> = {};

    // Search functionality
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
      ];
    }

    // Status filter
    if (query.status) {
      filter.status = query.status;
    }

    // Priority filter
    if (query.priority) {
      filter.priority = query.priority;
    }

    // Owner filter
    if (query.owner) {
      filter.owner = new Types.ObjectId(query.owner);
    }

    // Date range filters
    if (query.startDateFrom || query.startDateTo) {
      filter.startDate = {};
      if (query.startDateFrom) {
        filter.startDate.$gte = new Date(query.startDateFrom);
      }
      if (query.startDateTo) {
        filter.startDate.$lte = new Date(query.startDateTo);
      }
    }

    if (query.endDateFrom || query.endDateTo) {
      filter.endDate = {};
      if (query.endDateFrom) {
        filter.endDate.$gte = new Date(query.endDateFrom);
      }
      if (query.endDateTo) {
        filter.endDate.$lte = new Date(query.endDateTo);
      }
    }

    // Tags filter
    if (query.tags && query.tags.length > 0) {
      filter.tags = { $in: query.tags };
    }

    const projects = await this.findAll({
      ...filter,
      offset: query.offset,
      limit: query.limit,
      sortField: query.sortField as never,
      sortOrder: query.sortOrder,
      populate: ['owner', 'members', 'createdBy', 'updatedBy'],
    });

    const total = await this.countAll(filter);

    return {
      data: projects,
      total,
      page: Math.floor((query.offset || 0) / (query.limit || 10)) + 1,
      limit: query.limit || 10,
    };
  }

  async findByIdWithAccess(id: string, userId: string, userRole?: UserRole): Promise<Project> {
    const project = await this.findById(id, [
      'owner',
      'members',
      'createdBy',
      'updatedBy',
    ]);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Cho phép admin truy cập mọi project
    const hasAccess =
      project.owner.toString() === userId ||
      project.members.some(member => member.toString() === userId) ||
      userRole === UserRole.Admin;

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this project');
    }

    return project;
  }

  async updateWithAccess(
    id: string,
    input: UpdateProjectDto,
    userId: string,
    userRole: UserRole,
  ): Promise<Project> {
    const project = await this.findByIdWithAccess(id, userId, userRole);

    // Chỉ owner hoặc admin mới được update
    if (project.owner.toString() !== userId && userRole !== UserRole.Admin) {
      throw new ForbiddenException(
        'Only project owner or admin can update project details',
      );
    }

    const updateData = {
      ...input,
      updatedBy: new Types.ObjectId(userId),
      members: input.members?.map(id => new Types.ObjectId(id)),
    };

    const updatedProject = await this.update(id, updateData as any);
    if (!updatedProject) {
      throw new NotFoundException('Project not found');
    }

    return updatedProject;
  }

  async deleteWithAccess(id: string, userId: string): Promise<void> {
    const project = await this.findByIdWithAccess(id, userId);

    // Only owner can delete project
    if (project.owner.toString() !== userId) {
      throw new ForbiddenException('Only project owner can delete project');
    }

    await this.softDelete(id, userId);
  }

  async addMember(
    projectId: string,
    memberId: string,
    userId: string,
  ): Promise<Project> {
    const project = await this.findByIdWithAccess(projectId, userId);

    // Only owner can add members
    if (project.owner.toString() !== userId) {
      throw new ForbiddenException('Only project owner can add members');
    }

    if (!project.members.includes(new Types.ObjectId(memberId))) {
      project.members.push(new Types.ObjectId(memberId));
      const updatedProject = await this.update(projectId, {
        members: project.members,
        updatedBy: new Types.ObjectId(userId),
      } as any);
      return updatedProject!;
    }

    return project;
  }

  async removeMember(
    projectId: string,
    memberId: string,
    userId: string,
  ): Promise<Project> {
    const project = await this.findByIdWithAccess(projectId, userId);

    // Only owner can remove members
    if (project.owner.toString() !== userId) {
      throw new ForbiddenException('Only project owner can remove members');
    }

    project.members = project.members.filter(
      member => member.toString() !== memberId,
    );

    const updatedProject = await this.update(projectId, {
      members: project.members,
      updatedBy: new Types.ObjectId(userId),
    } as any);

    return updatedProject!;
  }

  async getProjectStats(userId: string): Promise<ProjectStatsDto> {
    const userObjectId = new Types.ObjectId(userId);

    const [stats] = await this.projectModel.aggregate([
      {
        $match: {
          $or: [{ owner: userObjectId }, { members: { $in: [userObjectId] } }],
          status: { $ne: 'Deleted' },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          planning: {
            $sum: {
              $cond: [{ $eq: ['$status', ProjectStatus.Planning] }, 1, 0],
            },
          },
          inProgress: {
            $sum: {
              $cond: [{ $eq: ['$status', ProjectStatus.InProgress] }, 1, 0],
            },
          },
          completed: {
            $sum: {
              $cond: [{ $eq: ['$status', ProjectStatus.Completed] }, 1, 0],
            },
          },
          onHold: {
            $sum: { $cond: [{ $eq: ['$status', ProjectStatus.OnHold] }, 1, 0] },
          },
          cancelled: {
            $sum: {
              $cond: [{ $eq: ['$status', ProjectStatus.Cancelled] }, 1, 0],
            },
          },
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$endDate', null] },
                    { $lt: ['$endDate', new Date()] },
                    { $ne: ['$status', ProjectStatus.Completed] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          totalBudget: { $sum: { $ifNull: ['$budget', 0] } },
          totalActualCost: { $sum: { $ifNull: ['$actualCost', 0] } },
          averageProgress: { $avg: { $ifNull: ['$progress', 0] } },
        },
      },
    ]);

    return (
      stats || {
        total: 0,
        planning: 0,
        inProgress: 0,
        completed: 0,
        onHold: 0,
        cancelled: 0,
        overdue: 0,
        totalBudget: 0,
        totalActualCost: 0,
        averageProgress: 0,
      }
    );
  }

  async getRecentProjects(userId: string, limit = 5): Promise<Project[]> {
    return this.projectModel
      .find({
        $or: [
          { owner: new Types.ObjectId(userId) },
          { members: { $in: [new Types.ObjectId(userId)] } },
        ],
        status: { $ne: 'Deleted' },
      })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .populate('owner', 'displayName username avatar')
      .populate('members', 'displayName username avatar')
      .exec();
  }
}
