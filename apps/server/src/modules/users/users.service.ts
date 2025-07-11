import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSaltSync, hashSync } from 'bcrypt';
import { Model, Types } from 'mongoose';
import { BaseService } from 'src/shared/base.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends BaseService<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {
    super(userModel);
  }

  async countNewUsersThisWeek(): Promise<number> {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    return await this.userModel.countDocuments({
      createdAt: { $gte: sevenDaysAgo, $lte: today },
    });
  }

  update(
    id: string | Types.ObjectId,
    input: UpdateUserDto,
  ): Promise<User | null | undefined> {
    if (input.password) {
      const salt = genSaltSync(10);
      input.password = hashSync(input.password, salt);
    }
    return super.update(id, input);
  }

  async getRecentUsers(): Promise<User[]> {
    return await this.userModel
      .find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('displayName email createdAt');
  }
}
