import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { UserSession, UserSessionSchema } from './entities/userSession.entity';
import { UserSessionsService } from './user-sessions.service';
import { SessionStatisticsService } from './session-statistics.service';
import { SessionAggregationService } from './session-aggregation.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserSession.name, schema: UserSessionSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserSessionsService,
    SessionStatisticsService,
    SessionAggregationService,
  ],
  exports: [
    UsersService,
    UserSessionsService,
    SessionStatisticsService,
    SessionAggregationService,
    MongooseModule,
  ],
})
export class UsersModule {}
