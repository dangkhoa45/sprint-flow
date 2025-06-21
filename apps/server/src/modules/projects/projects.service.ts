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
import { Project, ProjectStatus, ProjectDocument } from './entities/project.entity';
import { User, UserRole } from '../users/entities/user.entity';

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
    // members sẽ là Types.ObjectId[] khi lưu vào DB
    const projectData: Record<string, any> = {
      ...input,
      owner: new Types.ObjectId(userId),
      createdBy: new Types.ObjectId(userId),
      members: input.members?.map(id => new Types.ObjectId(id)) || [],
    };
    return super.create(projectData as any);
  }

  async findAllWithQuery(query: ProjectQueryDto, userId: string) {
    const { data, total } = await this.findAllWithCounts(query, userId);
    return {
      data,
      total,
      page: Math.floor((query.offset || 0) / (query.limit || 10)) + 1,
      limit: query.limit || 10,
    };
  }

  async findAllForAdmin(query: ProjectQueryDto) {
    const { data, total } = await this.findAllWithCounts(query);
    return {
      data,
      total,
      page: Math.floor((query.offset || 0) / (query.limit || 10)) + 1,
      limit: query.limit || 10,
    };
  }

  private async findAllWithCounts(query: ProjectQueryDto, userId?: string) {
    const filter: FilterQuery<Project> = {};
    const andConditions = [];

    if (query.search) {
      andConditions.push({
        $or: [
          { name: { $regex: query.search, $options: 'i' } },
          { description: { $regex: query.search, $options: 'i' } },
        ],
      });
    }

    if (query.status) {
      andConditions.push({ status: query.status });
    }
    if (query.priority) {
      andConditions.push({ priority: query.priority });
    }
    if (query.owner) {
      andConditions.push({ owner: new Types.ObjectId(query.owner) });
    }

    if (query.member) {
      andConditions.push({
        $or: [
          { owner: new Types.ObjectId(query.member) },
          { members: { $in: [new Types.ObjectId(query.member)] } },
        ],
      });
    } else if (userId) {
      andConditions.push({
        $or: [
          { owner: new Types.ObjectId(userId) },
          { members: { $in: [new Types.ObjectId(userId)] } },
        ],
      });
    }

    if (andConditions.length > 0) {
      filter.$and = andConditions;
    }

    const total = await this.projectModel.countDocuments(filter);

    const sortOptions: any = {};
    if (query.sortField && query.sortOrder) {
      sortOptions[query.sortField] = query.sortOrder === 'desc' ? -1 : 1;
    } else {
      sortOptions['createdAt'] = -1;
    }

    const aggregation: any = [
      { $match: filter },
      { $sort: sortOptions },
      { $skip: query.offset || 0 },
      { $limit: query.limit || 10 },
      { $lookup: { from: 'milestones', localField: '_id', foreignField: 'projectId', as: 'milestones' } },
      { $lookup: { from: 'attachments', localField: '_id', foreignField: 'projectId', as: 'attachments' } },
      { $lookup: { from: 'users', localField: 'owner', foreignField: '_id', as: 'owner' } },
      { $unwind: { path: '$owner', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'users', localField: 'members', foreignField: '_id', as: 'members' } },
      {
        $addFields: {
          milestoneCount: { $size: '$milestones' },
          attachmentCount: { $size: '$attachments' },
          id: '$_id',
        },
      },
      {
        $project: {
          milestones: 0,
          attachments: 0,
        },
      },
    ];

    const data = await this.projectModel.aggregate(aggregation);
    return { data, total };
  }

  async findByIdWithAccess(id: string, userId: string, userRole?: UserRole): Promise<Project> {
    const results = await this.projectModel.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      { $lookup: { from: 'milestones', localField: '_id', foreignField: 'projectId', as: 'milestones' } },
      { $lookup: { from: 'attachments', localField: '_id', foreignField: 'projectId', as: 'attachments' } },
      { $lookup: { from: 'users', localField: 'owner', foreignField: '_id', as: 'owner' } },
      { $unwind: { path: '$owner', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'users', localField: 'members', foreignField: '_id', as: 'members' } },
      { $lookup: { from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdBy' } },
      { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'users', localField: 'updatedBy', foreignField: '_id', as: 'updatedBy' } },
      { $unwind: { path: '$updatedBy', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          milestones: '$milestones',
          attachments: '$attachments',
          id: '$_id',
        },
      },
    ]);

    const project = results[0];

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const hasAccess =
      project.owner._id.toString() === userId ||
      project.members.some((member: User) => member._id.toString() === userId) ||
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

    // Nếu status cập nhật là Completed thì luôn set progress = 100
    const updateData: Record<string, any> = {
      ...input,
      updatedBy: new Types.ObjectId(userId),
      members: input.members?.map(id => new Types.ObjectId(id)),
      ...(input.status === ProjectStatus.Completed ? { progress: 100 } : {}),
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
      const updateData: Record<string, any> = {
        members: project.members,
        updatedBy: new Types.ObjectId(userId),
      };
      const updatedProject = await this.update(projectId, updateData as any);
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

    const updateData: Record<string, any> = {
      members: project.members,
      updatedBy: new Types.ObjectId(userId),
    };
    const updatedProject = await this.update(projectId, updateData as any);
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
