import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSessionDto } from './dto/create-session';
import { UpdateSessionDto } from './dto/update-session.dto';
import { UserSession } from './entities/userSession.entity';
import { SessionStatisticsService } from './session-statistics.service';
import { SessionAggregationService } from './session-aggregation.service';
import { BaseService } from 'src/shared/base.service';

@Injectable()
export class UserSessionsService extends BaseService<
  UserSession,
  CreateSessionDto,
  UpdateSessionDto
> {
  constructor(
    @InjectModel(UserSession.name)
    private readonly sessionModel: Model<UserSession>,
    private readonly statisticsService: SessionStatisticsService,
    private readonly aggregationService: SessionAggregationService,
  ) {
    super(sessionModel);
  }

  // Delegate statistics methods to SessionStatisticsService
  async workHourStat(filter?: any) {
    return this.statisticsService.workHourStat(filter);
  }

  async workSummary(filter?: any) {
    return this.statisticsService.workSummary(filter);
  }

  async statisticUsersMonthly(
    userIds: string[],
    startTime: Date,
    endTime: Date,
  ) {
    return this.statisticsService.statisticUsersMonthly(
      userIds,
      startTime,
      endTime,
    );
  }

  // Delegate aggregation methods to SessionAggregationService
  async findAllAggregate(filter?: any) {
    return this.aggregationService.findAllAggregate(filter);
  }

  async getTopAgentsByDate(filter?: any) {
    return this.aggregationService.getTopAgentsByDate(filter);
  }
}
