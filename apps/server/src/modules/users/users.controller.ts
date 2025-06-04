import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { compare, hashSync } from 'bcrypt';
import { diskStorage } from 'multer';
import path from 'path';
import { CurrentUser } from 'src/decorators/current-user.decor';
import { Public } from 'src/decorators/public.decor';
import { BaseController } from 'src/shared/base.controller';
import { BadRequestResponse } from 'src/shared/base.dto';
import { v4 as uuidv4 } from 'uuid';
import { TokenPayload } from '../auth/dto/tokenPayload';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController extends BaseController<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(private readonly usersService: UsersService) {
    super(usersService);
  }

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ type: User })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  async create(
    @Body() createInput: CreateUserDto,
    @CurrentUser() user: TokenPayload,
  ) {
    const exists = await this.usersService.findOne({
      username: createInput.username,
    });

    if (exists) {
      throw new BadRequestException('User is existed, try another username .');
    }

    const res = await super.create(createInput, user);
    return res;
  }

  @Public()
  @Post(':id/avatar')
  @ApiOperation({ summary: 'Upload user avatar' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${uuidv4()}${path.extname(file.originalname)}`;
          callback(null, uniqueSuffix);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(
            new BadRequestException('Only JPG/JPEG files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is not provided.');
    }
    const avatarUrl = `/uploads/avatars/${file.filename}`;
    const updatedUser = await this.usersService.update(id, {
      avatar: avatarUrl,
    });

    return {
      success: true,
      message: 'Avatar uploaded successfully',
      avatarUrl: updatedUser?.avatar,
    };
  }

  @Public()
  @Post('change-password/:id')
  @ApiOperation({ summary: 'Change user password' })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        currentPassword: { type: 'string' },
        newPassword: { type: 'string' },
      },
      required: ['currentPassword', 'newPassword'],
    },
  })
  @ApiOkResponse({ description: 'Password changed successfully' })
  @ApiBadRequestResponse({
    description: 'Invalid current password or new password',
  })
  async changePassword(
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
    @Param('id') userId: string,
  ) {
    if (!currentPassword || !newPassword) {
      throw new BadRequestException('Vui lòng cung cấp đầy đủ mật khẩu.');
    }

    const currentUser = await this.usersService.findOne({ _id: userId });
    if (!currentUser) {
      throw new BadRequestException('Người dùng không tồn tại.');
    }

    const isPasswordValid = await compare(
      currentPassword,
      currentUser.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Mật khẩu hiện tại không đúng.');
    }

    if (currentPassword === newPassword) {
      throw new BadRequestException(
        'Mật khẩu mới không được trùng với mật khẩu hiện tại.',
      );
    }

    const hashedPassword = hashSync(newPassword, 10);
    await this.usersService.update(userId, { password: hashedPassword });

    return {
      success: true,
      message: 'Đổi mật khẩu thành công.',
    };
  }
}
