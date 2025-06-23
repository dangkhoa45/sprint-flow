import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BaseService } from '../../shared/base.service';
import { CreateSessionDto, UpdateSessionDto } from './dto';
import { UserSession } from './entities/userSession.entity';

@Injectable()
export class SessionStatisticsService extends BaseService<
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

  private buildTimeFrameFilter(query?: any) {
    const {
      search,
      searchFields,
      offset,
      limit,
      sortField,
      sortOrder,
      populate,
      timeField,
      timeUnit,
      endTime,
      startTime,
      ...rest
    } = query ?? {};

    const filter = rest as FilterQuery<UserSession>;

    if (search && searchFields) {
      if (Array.isArray(searchFields)) {
        filter.$or = searchFields.map(field => ({
          [field]: { $regex: search },
        }));
      } else {
        filter[searchFields as keyof UserSession] = {
          $regex: search,
          $options: 'i',
        } as FilterQuery<UserSession>[keyof UserSession];
      }
    }

    filter.$and = [{ status: { $ne: 'Deleted' } }];

    if (timeField) {
      filter[timeField as keyof UserSession] = {
        $gte: new Date(startTime ?? '2000-01-01'),
        $lte: new Date(endTime ?? '2999-01-01'),
      } as FilterQuery<UserSession>[keyof UserSession];
    }

    return {
      filter,
      offset,
      limit,
      sortField,
      sortOrder,
      populate,
      timeUnit,
      timeField,
    };
  }

  async workHourStat(filter?: FilterQuery<UserSession>) {
    const {
      filter: filterOption,
      timeUnit,
      timeField,
    } = this.buildTimeFrameFilter(filter);

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

  async workSummary(filter?: FilterQuery<UserSession>) {
    const { filter: filterOption } = this.buildTimeFrameFilter(filter);

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
    userIds: string[],
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
}
