import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { CurrentUser } from 'src/decorators/current-user.decor';
import { Public } from 'src/decorators/public.decor';
import { ApiUserHeaders } from 'src/decorators/api-user-headers.decorator';
import { BadRequestResponse } from 'src/shared/base.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './dto/loginResponse.dto';
import { TokenPayload } from './dto/tokenPayload';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';

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
  @ApiUserHeaders()
  signIn(
    @Body() signInDto: LoginDto,
    @Headers('x-user-agent') ua = 'Swagger-Test-Client',
    @Headers('x-forwarded-for') xIP = '127.0.0.1',
  ) {
    const [ip] = (xIP || '127.0.0.1').split(',');
    return this.authService.signIn(
      signInDto.username,
      signInDto.password,
      ip.trim(),
      ua || 'Swagger-Test-Client',
    );
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    schema: {
      properties: {
        token: { type: 'string' },
      },
    },
  })
  @ApiOkResponse({ type: LoginResponse })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiUserHeaders()
  async refreshToken(
    @Body('token') token: string,
    @Headers('x-user-agent') ua = 'Swagger-Test-Client',
    @Headers('x-forwarded-for') xIP = '127.0.0.1',
  ) {
    try {
      const [ip] = (xIP || '127.0.0.1').split(',');
      return await this.authService.refreshToken(
        token,
        ip.trim(),
        ua || 'Swagger-Test-Client',
      );
    } catch {
      throw new UnauthorizedException();
    }
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

  @ApiBearerAuth()
  @Get('profile')
  @ApiOkResponse({ type: User })
  getProfile(@CurrentUser() user: TokenPayload) {
    return this.userService.findById(user.sub);
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

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  @ApiBody({ type: ForgotPasswordDto })
  @ApiOkResponse({ description: 'Password reset email sent successfully' })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  @ApiBody({ type: ResetPasswordDto })
  @ApiOkResponse({ description: 'Password reset successfully' })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }
}
