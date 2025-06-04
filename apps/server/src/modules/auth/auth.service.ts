import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hashSync } from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(uname: string, pass: string) {
    const user = await this.usersService.findOne({
      username: uname,
    });

    if (!user || !user.password) {
      throw new UnauthorizedException();
    }

    const isAuthenticated = await compare(pass, user.password);

    if (!isAuthenticated) {
      throw new UnauthorizedException();
    }

    const payload = {
      _id: user._id,
      username: user.username,
      displayName: user.displayName,
      tel: user.tel,
      role: user.role,
    };

    return {
      user: payload,
      token: await this.jwtService.signAsync(payload),
    };
  }

  async renew(token: string) {
    const payload = await this.jwtService.verifyAsync(token);

    return {
      user: payload,
      token: await this.jwtService.signAsync(payload),
    };
  }

  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, ...rest } = createUserDto;

    const existingUser = await this.usersService.findOne({ username });
    if (existingUser) {
      throw new BadRequestException('Username already exists.');
    }

    const hashedPassword = await hashSync(password, 10);

    const createdUser = await this.usersService.create({
      username,
      password: hashedPassword,
      ...rest,
    });

    return createdUser;
  }
}
