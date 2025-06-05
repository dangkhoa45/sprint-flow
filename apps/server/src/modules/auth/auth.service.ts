import { REFRESH_TOKEN_EXPIRE } from '@api/app.config';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcrypt';
import { UAParser } from 'ua-parser-js';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User, UserStatus } from '../users/entities/user.entity';
import { UserSessionsService } from '../users/user-sessions.service';
import { UsersService } from '../users/users.service';
import { TokenPayload } from './dto/tokenPayload';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private sessionService: UserSessionsService,
  ) {}

  async signIn(username: string, pass: string, ip: string, ua: string) {
    const user = await this.usersService.findOne({
      username,
      status: UserStatus.Active,
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    const isAuthenticated = await compareSync(pass, user.password);
    if (!isAuthenticated) {
      throw new UnauthorizedException();
    }

    const uaData = ua ? new UAParser(ua).getResult() : {};

    const session = await this.sessionService.create({
      user: user._id.toString(),
      startAt: new Date(),
      endAt: new Date(Date.now() + 1000 * 60 * 1),
      ip,
      ...uaData,
    });

    const payload: TokenPayload = {
      sub: user._id.toString(),
      una: user.username,
      dna: user.displayName,
      rol: user.role,
      ses: session._id.toString(),
    };

    await this.usersService.update(user._id, { lastLogin: new Date() });

    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: REFRESH_TOKEN_EXPIRE,
      }),
      profile: {
        _id: user._id.toString(),
        username: user.username,
        displayName: user.displayName,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }

  async refreshToken(token: string, ip: string, ua: string) {
    const payload = (await this.jwtService.verifyAsync(token)) as TokenPayload;

    const user = await this.usersService.findById(payload.sub);

    if (!user || user.status !== UserStatus.Active) {
      throw new ForbiddenException();
    }

    await this.usersService.update(user._id, { lastLogin: new Date() });

    const session = await this.sessionService.findById(payload.ses);

    if (!session?.endAt || Date.now() - +session.endAt > 1000 * 60 * 5) {
      const uaData = ua ? new UAParser(ua).getResult() : {};
      const newSession = await this.sessionService.create({
        user: payload.sub,
        startAt: new Date(),
        endAt: new Date(Date.now() + 1000 * 60 * 1),
        ip,
        ...uaData,
      });
      payload.ses = newSession._id.toString();
    } else {
      await this.sessionService.update(session._id, {
        endAt: new Date(Date.now() + 1000 * 60 * 1),
      });
    }

    delete payload.iat;
    delete payload.exp;

    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: REFRESH_TOKEN_EXPIRE,
      }),
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

  async forgotPassword(email: string) {
    // Tìm user theo email hoặc username (nếu email được dùng làm username)
    const user = await this.usersService.findOne({ 
      email: email 
    }) || await this.usersService.findOne({ 
      username: email 
    });

    if (!user) {
      // Không báo lỗi cụ thể để tránh enumeration attack
      return {
        message: 'If an account with that email exists, we have sent you a password reset link.',
      };
    }

    if (user.status !== UserStatus.Active) {
      throw new BadRequestException('Account is not active.');
    }

    // Tạo reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Lưu token vào database
    await this.usersService.update(user._id, {
      resetPasswordToken: hashSync(resetToken, 10),
      resetPasswordExpires: resetTokenExpiry,
    });

    // TODO: Gửi email với reset link
    // await this.emailService.sendPasswordResetEmail(user.email, resetToken);

    return {
      message: 'If an account with that email exists, we have sent you a password reset link.',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    if (!token || !newPassword) {
      throw new BadRequestException('Token and new password are required.');
    }

    // Tìm tất cả users có reset token chưa hết hạn
    const users = await this.usersService.findAll({});
    
    let user = null;
    for (const u of users) {
      if (u.resetPasswordToken && 
          u.resetPasswordExpires && 
          u.resetPasswordExpires > new Date() &&
          compareSync(token, u.resetPasswordToken)) {
        user = u;
        break;
      }
    }

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token.');
    }

    // Cập nhật password mới và xóa reset token
    const hashedPassword = hashSync(newPassword, 10);
    await this.usersService.update(user._id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    return {
      message: 'Password has been reset successfully.',
    };
  }
}
