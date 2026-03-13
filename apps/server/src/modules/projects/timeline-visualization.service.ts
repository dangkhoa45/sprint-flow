import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project, ProjectDocument } from './entities/project.entity';
import {
  TimelineEvent,
  TimelineEventDocument,
} from './entities/timeline.entity';
import { Milestone, MilestoneDocument } from './entities/milestone.entity';

export interface TimelineVisualizationData {
  projects: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    status: string;
    progress: number;
    milestones: {
      id: string;
      title: string;
      dueDate: Date;
      status: string;
      progress: number;
    }[];
  }[];
  timeline: {
    date: Date;
    events: {
      id: string;
      type: string;
      title: string;
      description: string;
      projectId: string;
      projectName: string;
    }[];
  }[];
  ganttData: {
    id: string;
    name: string;
    start: Date;
    end: Date;
    progress: number;
    dependencies: string[];
    type: 'project' | 'milestone';
    parent?: string;
  }[];
}

@Injectable()
export class TimelineVisualizationService {
  constructor(
    @InjectModel(Project.name)
    private projectModel: Model<ProjectDocument>,
    @InjectModel(TimelineEvent.name)
    private timelineEventModel: Model<TimelineEventDocument>,
    @InjectModel(Milestone.name)
    private milestoneModel: Model<MilestoneDocument>,
  ) {}

  async getTimelineVisualization(
    userId: string,
    dateFrom?: Date,
    dateTo?: Date,
    projectIds?: string[],
  ): Promise<TimelineVisualizationData> {
    const userObjectId = new Types.ObjectId(userId);

    // Build project filter
    const projectFilter: any = {
      $or: [{ owner: userObjectId }, { members: { $in: [userObjectId] } }],
      status: { $ne: 'Deleted' },
    };

    if (projectIds && projectIds.length > 0) {
      projectFilter._id = { $in: projectIds.map(id => new Types.ObjectId(id)) };
    }

    if (dateFrom || dateTo) {
      const dateFilter: any = {};
      if (dateFrom) dateFilter.$gte = dateFrom;
      if (dateTo) dateFilter.$lte = dateTo;

      projectFilter.$or = [
        { startDate: dateFilter },
        { endDate: dateFilter },
        {
          $and: [
            { startDate: { $lte: dateTo || new Date() } },
            { endDate: { $gte: dateFrom || new Date(0) } },
          ],
        },
      ];
    }

    // Get projects with milestones
    const projects = await this.projectModel.aggregate([
      { $match: projectFilter },
      {
        $lookup: {
          from: 'milestones',
          localField: '_id',
          foreignField: 'projectId',
          as: 'milestones',
        },
      },
      {
        $project: {
          name: 1,
          startDate: 1,
          endDate: 1,
          status: 1,
          progress: 1,
          milestones: {
            $map: {
              input: '$milestones',
              as: 'milestone',
              in: {
                id: '$$milestone._id',
                title: '$$milestone.title',
                dueDate: '$$milestone.dueDate',
                status: '$$milestone.status',
                progress: '$$milestone.progress',
              },
            },
          },
        },
      },
    ]);

    // Get timeline events
    const timelineEvents = await this.timelineEventModel.aggregate([
      {
        $match: {
          projectId: { $in: projects.map(p => p._id) },
          ...(dateFrom || dateTo
            ? {
                createdAt: {
                  ...(dateFrom && { $gte: dateFrom }),
                  ...(dateTo && { $lte: dateTo }),
                },
              }
            : {}),
        },
      },
      {
        $lookup: {
          from: 'projects',
          localField: 'projectId',
          foreignField: '_id',
          as: 'project',
        },
      },
      { $unwind: '$project' },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          },
          events: {
            $push: {
              id: '$_id',
              type: '$type',
              title: '$title',
              description: '$description',
              projectId: '$projectId',
              projectName: '$project.name',
            },
          },
        },
      },
      {
        $project: {
          date: { $dateFromString: { dateString: '$_id.date' } },
          events: 1,
          _id: 0,
        },
      },
      { $sort: { date: 1 } },
    ]);

    // Generate Gantt chart data
    const ganttData = [];

    for (const project of projects) {
      // Add project to gantt data
      ganttData.push({
        id: project._id.toString(),
        name: project.name,
        start: project.startDate || new Date(),
        end: project.endDate || new Date(),
        progress: project.progress || 0,
        dependencies: [], // Could be populated from project dependencies
        type: 'project' as const,
      });

      // Add milestones to gantt data
      for (const milestone of project.milestones) {
        ganttData.push({
          id: milestone.id.toString(),
          name: milestone.title,
          start: milestone.dueDate,
          end: milestone.dueDate,
          progress: milestone.progress || 0,
          dependencies: [],
          type: 'milestone' as const,
          parent: project._id.toString(),
        });
      }
    }

    return {
      projects: projects.map(p => ({
        id: p._id.toString(),
        name: p.name,
        startDate: p.startDate,
        endDate: p.endDate,
        status: p.status,
        progress: p.progress,
        milestones: p.milestones,
      })),
      timeline: timelineEvents,
      ganttData,
    };
  }

  async getProjectTimeline(projectId: string, userId: string): Promise<any> {
    const userObjectId = new Types.ObjectId(userId);
    const projectObjectId = new Types.ObjectId(projectId);

    // Verify access to project
    const project = await this.projectModel.findOne({
      _id: projectObjectId,
      $or: [{ owner: userObjectId }, { members: { $in: [userObjectId] } }],
    });

    if (!project) {
      throw new Error('Project not found or access denied');
    }

    // Get project timeline events
    const events = await this.timelineEventModel
      .find({ projectId: projectObjectId })
      .sort({ createdAt: -1 })
      .populate('user', 'displayName username avatar')
      .exec();

    // Get project milestones
    const milestones = await this.milestoneModel
      .find({ projectId: projectObjectId })
      .sort({ dueDate: 1 })
      .exec();

    return {
      project: {
        id: project._id.toString(),
        name: project.name,
        status: project.status,
        progress: project.progress,
        startDate: project.startDate,
        endDate: project.endDate,
      },
      events,
      milestones,
    };
  }

  async getTimelineStats(userId: string): Promise<any> {
    const userObjectId = new Types.ObjectId(userId);
    const now = new Date();
    const startOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay(),
    );
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [stats] = await this.timelineEventModel.aggregate([
      {
        $match: {
          user: userObjectId,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          today: {
            $sum: {
              $cond: [
                {
                  $gte: [
                    '$createdAt',
                    new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                  ],
                },
                1,
                0,
              ],
            },
          },
          thisWeek: {
            $sum: {
              $cond: [{ $gte: ['$createdAt', startOfWeek] }, 1, 0],
            },
          },
          thisMonth: {
            $sum: {
              $cond: [{ $gte: ['$createdAt', startOfMonth] }, 1, 0],
            },
          },
        },
      },
    ]);

    return (
      stats || {
        total: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
      }
    );
  }
}
