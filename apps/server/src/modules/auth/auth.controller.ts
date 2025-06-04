import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Session,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { SessionData } from 'express-session';
import { CurrentUser } from 'src/decorators/current-user.decor';
import { Public } from 'src/decorators/public.decor';
import { BadRequestResponse } from 'src/shared/base.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './dto/loginResponse.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: LoginResponse })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  async login(@Body() signInDto: LoginDto, @Session() session: SessionData) {
    const data = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );

    session.token = data.token;
    return data;
  }

  @Public()
  @Post('logout')
  logout(@Req() req: Request) {
    return new Promise((resolve, reject) => {
      req.session.destroy((error: Error) => {
        if (error) {
          reject(error);
        } else {
          resolve('');
        }
      });
    });
  }

  @Post('check-session')
  checkSession(@CurrentUser() user: User) {
    return { user };
  }

  @Get('profile')
  @ApiOkResponse({ type: User })
  getProfile(@CurrentUser() user: User) {
    const dataUser = this.userService.findById(user._id);

    return dataUser;
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ type: User })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  async registerUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.registerUser(createUserDto);
  }
}
