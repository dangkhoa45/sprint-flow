import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { CurrentUser } from 'src/decorators/current-user.decor';
import { BadRequestResponse } from 'src/shared/base.dto';
import { TokenPayload } from '../auth/dto/tokenPayload';
import { AuthGuard } from '../auth/auth.guard';
import { AttachmentQueryDto } from './dto/attachment-query.dto';
import { Attachment } from './entities/attachment.entity';
import { AttachmentsService } from './attachments.service';
import { UploadAttachmentDto } from './dto/upload-attachment.dto';
import { Request, Response } from 'express';

@ApiTags('Attachments')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post(':projectId/upload')
  @ApiOperation({ summary: 'Upload file attachment to project' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/attachments',
        filename: (req, file, callback) => {
          if (!file?.originalname) {
            return callback(
              new BadRequestException('File is invalid or missing a name.'),
              null,
            );
          }
          const uniqueSuffix = `${uuidv4()}${path.extname(file.originalname)}`;
          callback(null, uniqueSuffix);
        },
      }),
      fileFilter: (req, file, callback) => {
        // Allow common file types
        const allowedMimes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/plain',
          'text/csv',
          'application/zip',
          'application/x-rar-compressed',
          'video/mp4',
          'video/avi',
          'video/mov',
          'audio/mpeg',
          'audio/wav',
          'audio/mp3',
        ];

        if (!allowedMimes.includes(file.mimetype)) {
          return callback(
            new BadRequestException('File type not allowed!'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 100 * 1024 * 1024,
      },
    }),
  )
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The file to upload',
        },
        description: {
          type: 'string',
        },
        tags: {
          type: 'string',
          description: 'Comma-separated tags',
        },
      },
    },
  })
  @ApiCreatedResponse({ type: Attachment })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @ApiForbiddenResponse({ description: 'Access denied to project' })
  async uploadAttachment(
    @Param('projectId') projectId: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: TokenPayload,
    @Req() req: Request,
  ) {
    if (!file) {
      throw new BadRequestException('File is not provided.');
    }

    const { description, tags } = req.body as UploadAttachmentDto;
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

    return this.attachmentsService.uploadAttachment(
      file,
      projectId,
      user.sub,
      description,
      tagsArray,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all attachments with filtering and pagination',
  })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Attachment' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['document', 'image', 'video', 'audio', 'archive', 'other'],
  })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  @ApiQuery({ name: 'uploadedBy', required: false, type: String })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query() query: AttachmentQueryDto,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.attachmentsService.findAllWithQuery(query, user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get attachment by ID' })
  @ApiOkResponse({ type: Attachment })
  @ApiNotFoundResponse({ description: 'Attachment not found' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<Attachment> {
    return this.attachmentsService.findById(id, [
      'uploadedBy',
      'createdBy',
      'updatedBy',
    ]);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete attachment by ID' })
  @ApiOkResponse({ description: 'Attachment deleted successfully' })
  @ApiNotFoundResponse({ description: 'Attachment not found' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<{ message: string }> {
    await this.attachmentsService.deleteWithAccess(id, user.sub);
    return { message: 'Attachment deleted successfully' };
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download an attachment file' })
  @ApiOkResponse({
    description: 'The file is sent as a download.',
    content: {
      'application/octet-stream': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Attachment not found' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  async downloadAttachment(
    @Param('id') id: string,
    @CurrentUser() user: TokenPayload,
    @Res() res: Response,
  ) {
    const attachment =
      await this.attachmentsService.getAttachmentAndCheckAccess(id, user.sub);

    return res.download(attachment.path, attachment.originalName);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get all attachments for a specific project' })
  @ApiOkResponse({ type: [Attachment] })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @ApiForbiddenResponse({ description: 'Access denied to project' })
  async findByProject(
    @Param('projectId') projectId: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<Attachment[]> {
    const query: AttachmentQueryDto = { projectId };
    const result = await this.attachmentsService.findAllWithQuery(
      query,
      user.sub,
    );
    return result.data;
  }
}
