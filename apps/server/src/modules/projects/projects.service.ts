import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { BaseService } from 'src/shared/base.service';
import { User, UserRole } from '../users/entities/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectQueryDto, ProjectStatsDto } from './dto/project-query.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, ProjectStatus } from './entities/project.entity';

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
    return await super.create(projectData as any);
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

    // Enhanced search with multiple fields and options
    if (query.search) {
      const searchFields = query.searchFields || ['name', 'description'];
      const searchOptions = query.caseSensitive ? '' : 'i';
      const searchRegex = query.exactMatch
        ? new RegExp(`^${query.search}$`, searchOptions)
        : new RegExp(query.search, searchOptions);

      const searchConditions = searchFields.map(field => ({
        [field]: searchRegex,
      }));

      andConditions.push({ $or: searchConditions });
    }

    // Enhanced status filtering (multiple values)
    if (query.status && query.status.length > 0) {
      andConditions.push({ status: { $in: query.status } });
    }

    // Enhanced priority filtering (multiple values)
    if (query.priority && query.priority.length > 0) {
      andConditions.push({ priority: { $in: query.priority } });
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
      // Handle special filtering options
      if (query.myOwnedProjects) {
        andConditions.push({ owner: new Types.ObjectId(userId) });
      } else if (query.myProjects !== false) {
        andConditions.push({
          $or: [
            { owner: new Types.ObjectId(userId) },
            { members: { $in: [new Types.ObjectId(userId)] } },
          ],
        });
      }
    }

    // Date range filters
    if (query.startDateFrom || query.startDateTo) {
      const dateFilter: any = {};
      if (query.startDateFrom) dateFilter.$gte = new Date(query.startDateFrom);
      if (query.startDateTo) dateFilter.$lte = new Date(query.startDateTo);
      andConditions.push({ startDate: dateFilter });
    }

    if (query.endDateFrom || query.endDateTo) {
      const dateFilter: any = {};
      if (query.endDateFrom) dateFilter.$gte = new Date(query.endDateFrom);
      if (query.endDateTo) dateFilter.$lte = new Date(query.endDateTo);
      andConditions.push({ endDate: dateFilter });
    }

    if (query.createdFrom || query.createdTo) {
      const dateFilter: any = {};
      if (query.createdFrom) dateFilter.$gte = new Date(query.createdFrom);
      if (query.createdTo) dateFilter.$lte = new Date(query.createdTo);
      andConditions.push({ createdAt: dateFilter });
    }

    if (query.updatedFrom || query.updatedTo) {
      const dateFilter: any = {};
      if (query.updatedFrom) dateFilter.$gte = new Date(query.updatedFrom);
      if (query.updatedTo) dateFilter.$lte = new Date(query.updatedTo);
      andConditions.push({ updatedAt: dateFilter });
    }

    // Numeric range filters
    if (query.progressFrom !== undefined || query.progressTo !== undefined) {
      const progressFilter: any = {};
      if (query.progressFrom !== undefined)
        progressFilter.$gte = query.progressFrom;
      if (query.progressTo !== undefined)
        progressFilter.$lte = query.progressTo;
      andConditions.push({ progress: progressFilter });
    }

    if (
      query.estimatedHoursFrom !== undefined ||
      query.estimatedHoursTo !== undefined
    ) {
      const hoursFilter: any = {};
      if (query.estimatedHoursFrom !== undefined)
        hoursFilter.$gte = query.estimatedHoursFrom;
      if (query.estimatedHoursTo !== undefined)
        hoursFilter.$lte = query.estimatedHoursTo;
      andConditions.push({ estimatedHours: hoursFilter });
    }

    if (
      query.actualHoursFrom !== undefined ||
      query.actualHoursTo !== undefined
    ) {
      const hoursFilter: any = {};
      if (query.actualHoursFrom !== undefined)
        hoursFilter.$gte = query.actualHoursFrom;
      if (query.actualHoursTo !== undefined)
        hoursFilter.$lte = query.actualHoursTo;
      andConditions.push({ actualHours: hoursFilter });
    }

    // Tags filtering
    if (query.tags && query.tags.length > 0) {
      andConditions.push({ tags: { $in: query.tags } });
    }

    // Overdue filter
    if (query.overdue) {
      andConditions.push({
        $and: [
          { endDate: { $ne: null } },
          { endDate: { $lt: new Date() } },
          { status: { $ne: ProjectStatus.Completed } },
        ],
      });
    }

    // Created by filter
    if (query.createdBy) {
      andConditions.push({ createdBy: new Types.ObjectId(query.createdBy) });
    }

    if (andConditions.length > 0) {
      filter.$and = andConditions;
    }

    const total = await this.projectModel.countDocuments(filter);

    const sortOptions: any = {};
    if (query.sortField && query.sortOrder) {
      sortOptions[query.sortField] = query.sortOrder === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = -1;
    }

    const aggregation: any = [
      { $match: filter },
      { $sort: sortOptions },
      { $skip: query.offset || 0 },
      { $limit: query.limit || 10 },
      {
        $lookup: {
          from: 'milestones',
          localField: '_id',
          foreignField: 'projectId',
          as: 'milestones',
        },
      },
      {
        $lookup: {
          from: 'attachments',
          localField: '_id',
          foreignField: 'projectId',
          as: 'attachments',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner',
        },
      },
      { $unwind: { path: '$owner', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'users',
          localField: 'members',
          foreignField: '_id',
          as: 'members',
        },
      },
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

  async findByIdWithAccess(
    id: string,
    userId: string,
    userRole?: UserRole,
  ): Promise<Project> {
    const results = await this.projectModel.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'milestones',
          localField: '_id',
          foreignField: 'projectId',
          as: 'milestones',
        },
      },
      {
        $lookup: {
          from: 'attachments',
          localField: '_id',
          foreignField: 'projectId',
          as: 'attachments',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
          foreignField: '_id',
          as: 'owner',
        },
      },
      { $unwind: { path: '$owner', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'users',
          localField: 'members',
          foreignField: '_id',
          as: 'members',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy',
        },
      },
      { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'users',
          localField: 'updatedBy',
          foreignField: '_id',
          as: 'updatedBy',
        },
      },
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
      project.members.some(
        (member: User) => member._id.toString() === userId,
      ) ||
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

  async getAdvancedProjectStats(userId: string): Promise<any> {
    const userObjectId = new Types.ObjectId(userId);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

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
          totalEstimatedHours: { $sum: { $ifNull: ['$estimatedHours', 0] } },
          totalActualHours: { $sum: { $ifNull: ['$actualHours', 0] } },
          averageEstimatedHours: { $avg: { $ifNull: ['$estimatedHours', 0] } },
          averageActualHours: { $avg: { $ifNull: ['$actualHours', 0] } },
          projectsCreatedThisMonth: {
            $sum: {
              $cond: [{ $gte: ['$createdAt', startOfMonth] }, 1, 0],
            },
          },
          projectsCompletedThisMonth: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$status', ProjectStatus.Completed] },
                    { $gte: ['$updatedAt', startOfMonth] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    // Get tag statistics
    const tagStats = await this.projectModel.aggregate([
      {
        $match: {
          $or: [{ owner: userObjectId }, { members: { $in: [userObjectId] } }],
          status: { $ne: 'Deleted' },
        },
      },
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          tag: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Get priority and status distributions
    const priorityStats = await this.projectModel.aggregate([
      {
        $match: {
          $or: [{ owner: userObjectId }, { members: { $in: [userObjectId] } }],
          status: { $ne: 'Deleted' },
        },
      },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          priority: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    const statusStats = await this.projectModel.aggregate([
      {
        $match: {
          $or: [{ owner: userObjectId }, { members: { $in: [userObjectId] } }],
          status: { $ne: 'Deleted' },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    const baseStats = stats || {
      total: 0,
      planning: 0,
      inProgress: 0,
      completed: 0,
      onHold: 0,
      cancelled: 0,
      overdue: 0,
      averageProgress: 0,
      totalEstimatedHours: 0,
      totalActualHours: 0,
      averageEstimatedHours: 0,
      averageActualHours: 0,
      projectsCreatedThisMonth: 0,
      projectsCompletedThisMonth: 0,
    };

    const efficiencyRatio =
      baseStats.totalEstimatedHours > 0
        ? baseStats.totalActualHours / baseStats.totalEstimatedHours
        : 0;

    return {
      ...baseStats,
      mostUsedTags: tagStats,
      projectsByPriority: priorityStats,
      projectsByStatus: statusStats,
      efficiencyRatio: Math.round(efficiencyRatio * 100) / 100,
    };
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

  async manageDependencies(
    projectId: string,
    dependencies: string[],
    userId: string,
  ): Promise<Project> {
    const project = await this.findByIdWithAccess(projectId, userId);

    // Validate dependencies exist and are accessible
    const dependencyIds = dependencies.map(id => new Types.ObjectId(id));
    const existingDeps = await this.projectModel
      .find({ _id: { $in: dependencyIds } })
      .select('_id name status');

    if (existingDeps.length !== dependencies.length) {
      throw new NotFoundException('One or more dependency projects not found');
    }

    // Check for circular dependencies
    const circularCheck = await this.checkCircularDependencies(
      projectId,
      dependencies,
    );
    if (circularCheck.hasCircular) {
      throw new BadRequestException(
        `Circular dependency detected: ${circularCheck.path.join(' -> ')}`,
      );
    }

    // Update dependencies
    const oldDependencies = project.dependencies || [];
    project.dependencies = dependencyIds;

    // Update dependents for affected projects
    const toRemove = oldDependencies.filter(
      dep => !dependencyIds.some(newDep => newDep.equals(dep)),
    );
    const toAdd = dependencyIds.filter(
      dep => !oldDependencies.some(oldDep => oldDep.equals(dep)),
    );

    // Remove this project from old dependencies' dependents
    if (toRemove.length > 0) {
      await this.projectModel.updateMany(
        { _id: { $in: toRemove } },
        { $pull: { dependents: new Types.ObjectId(projectId) } },
      );
    }

    // Add this project to new dependencies' dependents
    if (toAdd.length > 0) {
      await this.projectModel.updateMany(
        { _id: { $in: toAdd } },
        { $addToSet: { dependents: new Types.ObjectId(projectId) } },
      );
    }

    const updatedProject = await this.update(projectId, {
      dependencies: dependencyIds,
      updatedBy: new Types.ObjectId(userId),
    } as any);

    return updatedProject!;
  }

  async checkCircularDependencies(
    projectId: string,
    newDependencies: string[],
  ): Promise<{ hasCircular: boolean; path: string[] }> {
    const visited = new Set<string>();
    const path: string[] = [];

    const dfs = async (currentId: string): Promise<boolean> => {
      if (visited.has(currentId)) {
        return currentId === projectId;
      }

      visited.add(currentId);
      path.push(currentId);

      const project = await this.projectModel
        .findById(currentId)
        .select('dependencies');
      if (!project) return false;

      const deps =
        currentId === projectId
          ? newDependencies
          : project.dependencies?.map(dep => dep.toString()) || [];

      for (const dep of deps) {
        if (await dfs(dep)) {
          return true;
        }
      }

      path.pop();
      return false;
    };

    const hasCircular = await dfs(projectId);
    return { hasCircular, path };
  }

  async getDependencyAnalysis(projectId: string, userId: string): Promise<any> {
    const project = await this.findByIdWithAccess(projectId, userId);

    const dependencies = await this.projectModel
      .find({ _id: { $in: project.dependencies || [] } })
      .select('name status progress endDate')
      .exec();

    const dependents = await this.projectModel
      .find({ _id: { $in: project.dependents || [] } })
      .select('name status progress endDate')
      .exec();

    const dependencyInfo = dependencies.map(dep => ({
      projectId: dep._id.toString(),
      name: dep.name,
      status: dep.status,
      progress: dep.progress,
      endDate: dep.endDate,
      isBlocking: dep.status !== ProjectStatus.Completed,
    }));

    const dependentInfo = dependents.map(dep => ({
      projectId: dep._id.toString(),
      name: dep.name,
      status: dep.status,
      progress: dep.progress,
      endDate: dep.endDate,
      isBlocking: false,
    }));

    const blockedBy = dependencyInfo
      .filter(dep => dep.isBlocking)
      .map(dep => dep.name);

    const blocking = dependentInfo
      .filter(dep => project.status !== ProjectStatus.Completed)
      .map(dep => dep.name);

    return {
      dependencies: dependencyInfo,
      dependents: dependentInfo,
      canStart: blockedBy.length === 0,
      blockedBy,
      blocking,
      criticalPath: [], // Could be implemented with more complex analysis
    };
  }

  async updateResourceAllocation(
    projectId: string,
    resourceAllocation: any,
    userId: string,
  ): Promise<Project> {
    await this.findByIdWithAccess(projectId, userId);

    const updatedProject = await this.update(projectId, {
      resourceAllocation,
      updatedBy: new Types.ObjectId(userId),
    } as any);

    return updatedProject!;
  }

  async getResourceAllocation(projectId: string, userId: string): Promise<any> {
    const project = await this.findByIdWithAccess(projectId, userId);
    return project.resourceAllocation || {};
  }

  async getResourceUtilization(userId: string): Promise<any> {
    const userObjectId = new Types.ObjectId(userId);

    const [result] = await this.projectModel.aggregate([
      {
        $match: {
          $or: [{ owner: userObjectId }, { members: { $in: [userObjectId] } }],
          status: { $ne: 'Deleted' },
        },
      },
      {
        $group: {
          _id: null,
          totalBudget: { $sum: { $ifNull: ['$resourceAllocation.budget', 0] } },
          totalSpent: {
            $sum: { $ifNull: ['$resourceAllocation.spentBudget', 0] },
          },
          totalTeamMembers: {
            $sum: { $ifNull: ['$resourceAllocation.teamMembers', 0] },
          },
          averageUtilization: { $avg: { $ifNull: ['$progress', 0] } },
        },
      },
    ]);

    return (
      result || {
        totalBudget: 0,
        totalSpent: 0,
        totalTeamMembers: 0,
        averageUtilization: 0,
      }
    );
  }
}
