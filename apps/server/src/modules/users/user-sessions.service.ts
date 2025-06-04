import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BaseQuery, SortOrder, TimeFrameQuery } from 'src/shared/base.input';
import { BaseService } from 'src/shared/base.service';
import { CreateSessionDto } from './dto/create-session';
import { UpdateSessionDto } from './dto/update-session.dto';
import { UserSession } from './entities/userSession.entity';

@Injectable()
export class UserSessionsService extends BaseService<
  UserSession,
  CreateSessionDto,
  UpdateSessionDto
> {
  constructor(
    @InjectModel(UserSession.name)
    private readonly sessionModel: Model<UserSession>,
  ) {
    super(sessionModel);
  }

  async findAllAggregate(
    filter?: FilterQuery<UserSession> & BaseQuery<UserSession>,
  ) {
    const {
      filter: filterOption,
      offset,
      limit,
      sortField,
      sortOrder,
    } = this.buildFilter(filter);

    return await this.sessionModel
      .aggregate([
        {
          $match: filterOption,
        },
        {
          $lookup: {
            from: 'docfiles',
            as: 'docfiles',
            let: { sessionId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [
                      {
                        $eq: ['$verifierSession', '$$sessionId'],
                      },
                      {
                        $eq: ['$workSession', '$$sessionId'],
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
        {
          $addFields: {
            docs: { $size: '$docfiles' },
            duration: {
              $dateDiff: {
                startDate: '$startAt',
                endDate: '$endAt',
                unit: 'minute',
              },
            },
          },
        },
        {
          $project: {
            docfiles: 0,
          },
        },
        !sortField || !sortOrder
          ? {
              $sort: {
                _id: -1,
              },
            }
          : {
              $sort: {
                [sortField]: sortOrder == SortOrder.Asc ? 1 : -1,
              },
            },
      ])
      .skip(offset ?? 0)
      .limit(limit ?? 10);
  }

  async workHourStat(
    filter?: FilterQuery<UserSession> & TimeFrameQuery<UserSession>,
  ) {
    const {
      filter: filterOption,
      timeUnit,
      timeField,
    } = this.buildFilter(filter);
    return this.sessionModel.aggregate([
      { $match: filterOption },
      {
        $lookup: {
          from: 'docfiles',
          localField: '_id',
          foreignField: 'workSession',
          as: 'docfiles',
        },
      },
      {
        $lookup: {
          from: 'docfiles',
          as: 'verifiedDocFiles',
          let: { sessionId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$verifierSession', '$$sessionId'],
                    },
                    {
                      $ne: ['$workSession', '$$sessionId'],
                    },
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          docs: { $size: '$docfiles' },
          verifiedDocs: { $size: '$verifiedDocFiles' },
        },
      },
      {
        $addFields: {
          duration: {
            $dateDiff: {
              startDate: '$startAt',
              endDate: '$endAt',
              unit: 'minute',
            },
          },
        },
      },
      {
        $group: {
          _id: {
            $dateTrunc: {
              date: `$${timeField}`,
              unit: timeUnit ?? 'day',
              timezone: '+07',
            },
          },
          minutes: { $sum: '$duration' },
          docs: { $sum: '$docs' },
          verifiedDocs: { $sum: '$verifiedDocs' },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
  }

  async workSummary(
    filter?: FilterQuery<UserSession> & TimeFrameQuery<UserSession>,
  ) {
    const { filter: filterOption } = this.buildFilter(filter);
    return this.sessionModel
      .aggregate([
        { $match: filterOption },
        {
          $lookup: {
            from: 'docfiles',
            localField: '_id',
            foreignField: 'workSession',
            as: 'docfiles',
          },
        },
        {
          $lookup: {
            from: 'docfiles',
            as: 'verifiedDocFiles',
            let: { sessionId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ['$verifierSession', '$$sessionId'],
                      },
                      {
                        $ne: ['$workSession', '$$sessionId'],
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
        {
          $addFields: {
            docs: { $size: '$docfiles' },
            verifiedDocs: { $size: '$verifiedDocFiles' },
          },
        },
        {
          $match: {
            $or: [
              {
                docs: { $gt: 0 },
              },
              {
                verifiedDocs: { $gt: 0 },
              },
            ],
          },
        },
        {
          $addFields: {
            duration: {
              $dateDiff: {
                startDate: '$startAt',
                endDate: '$endAt',
                unit: 'minute',
              },
            },
          },
        },
        {
          $group: {
            _id: 1,
            minutes: {
              $sum: '$duration',
            },
            docs: {
              $sum: '$docs',
            },
            verifiedDocs: {
              $sum: '$verifiedDocs',
            },
          },
        },
      ])
      .then(res => res[0] ?? {});
  }

  async statisticUsersMonthly(
    userIds: Array<string>,
    startTime: Date,
    endTime: Date,
  ) {
    return await this.sessionModel.aggregate([
      {
        $match: {
          user: {
            $in: userIds,
          },
          status: {
            $ne: 'Deleted',
          },
          updatedAt: {
            $gte: startTime,
            $lte: endTime,
          },
        },
      },
      {
        $lookup: {
          from: 'docfiles',
          localField: '_id',
          foreignField: 'workSession',
          as: 'docfiles',
        },
      },
      {
        $lookup: {
          from: 'docfiles',
          as: 'verifiedDocFiles',
          let: {
            sessionId: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$verifierSession', '$$sessionId'],
                    },
                    {
                      $ne: ['$workSession', '$$sessionId'],
                    },
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          docs: {
            $size: '$docfiles',
          },
          verifiedDocs: {
            $size: '$verifiedDocFiles',
          },
        },
      },
      {
        $match: {
          $or: [
            {
              docs: {
                $gt: 0,
              },
            },
            {
              verifiedDocs: {
                $gt: 0,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          duration: {
            $dateDiff: {
              startDate: '$startAt',
              endDate: '$endAt',
              unit: 'minute',
            },
          },
        },
      },
      {
        $group: {
          _id: '$user',
          minutes: {
            $sum: '$duration',
          },
          docs: {
            $sum: '$docs',
          },
          verifiedDocs: {
            $sum: '$verifiedDocs',
          },
          id: {
            $first: {
              $toObjectId: '$user',
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          minutes: -1,
        },
      },
    ]);
  }

  async getTopAgentsByDate(
    filter?: FilterQuery<UserSession> & TimeFrameQuery<UserSession>,
  ) {
    const {
      filter: filterOption,
      limit,
      offset,
      sortField,
    } = this.buildFilter(filter);
    const response = await this.sessionModel.aggregate([
      {
        $match: filterOption,
      },
      {
        $lookup: {
          from: 'docfiles',
          localField: '_id',
          foreignField: 'workSession',
          as: 'processedDocs',
        },
      },
      {
        $lookup: {
          from: 'docfiles',
          as: 'verifiedDocFiles',
          let: {
            sessionId: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$verifierSession', '$$sessionId'],
                    },
                    {
                      $ne: ['$workSession', '$$sessionId'],
                    },
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          processedDocs: {
            $size: '$processedDocs',
          },
          verifiedDocs: {
            $size: '$verifiedDocFiles',
          },
        },
      },
      {
        $addFields: {
          totalDocs: {
            $sum: ['$processedDocs', '$verifiedDocs'],
          },
        },
      },
      {
        $match: {
          totalDocs: {
            $gt: 0,
          },
        },
      },
      {
        $addFields: {
          duration: {
            $dateDiff: {
              startDate: '$startAt',
              endDate: '$endAt',
              unit: 'minute',
            },
          },
        },
      },
      {
        $group: {
          _id: '$user',
          totalMinutes: {
            $sum: '$duration',
          },
          processedDocs: {
            $sum: '$processedDocs',
          },
          verifiedDocs: {
            $sum: '$verifiedDocs',
          },
          totalDocs: {
            $sum: '$totalDocs',
          },
          id: {
            $first: {
              $toObjectId: '$user',
            },
          },
        },
      },
      {
        $facet: {
          total: [
            {
              $count: 'count',
            },
          ],
          items: [
            {
              $sort: {
                [sortField || 'totalDocs']: -1,
              },
            },
            {
              $skip: offset || 0,
            },
            {
              $limit: limit || 10,
            },
            {
              $lookup: {
                from: 'users',
                localField: 'id',
                foreignField: '_id',
                as: 'user',
                pipeline: [
                  {
                    $project: {
                      _id: 1,
                      displayName: 1,
                      avatar: 1,
                      role: 1,
                      status: 1,
                      email: 1,
                      lastLogin: 1,
                      username: 1,
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: '$user',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $addFields: {
                hours: {
                  $floor: {
                    $divide: ['$totalMinutes', 60],
                  },
                },
                minutes: {
                  $mod: ['$totalMinutes', 60],
                },
              },
            },
            {
              $sort: {
                [sortField || 'totalDocs']: -1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$total',
        },
      },
    ]);

    if (!response.length) {
      return {
        total: 0,
        items: [],
        query: filter,
      };
    }

    return {
      total: response[0].total.count,
      items: response[0].items,
      query: filter,
    };
  }
}
