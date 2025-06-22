import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { BaseService } from 'src/shared/base.service';
import { AttachmentQueryDto } from './dto/attachment-query.dto';
import { Attachment, AttachmentType } from './entities/attachment.entity';
import { Project } from './entities/project.entity';
import { TimelineEvent, TimelineEventType } from './entities/timeline.entity';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class AttachmentsService extends BaseService<Attachment, any, any> {
  constructor(
    @InjectModel(Attachment.name)
    private readonly attachmentModel: Model<Attachment>,
    @InjectModel(Project.name)
    private readonly projectModel: Model<Project>,
    @InjectModel(TimelineEvent.name)
    private readonly timelineEventModel: Model<TimelineEvent>,
  ) {
    super(attachmentModel);
  }

  async uploadAttachment(
    file: Express.Multer.File,
    projectId: string,
    userId: string,
    description?: string,
    tags?: string[],
  ): Promise<Attachment> {
    // Check if project exists and user has access
    const project = await this.projectModel.findById(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (
      project.owner.toString() !== userId &&
      !project.members.includes(new Types.ObjectId(userId))
    ) {
      throw new ForbiddenException('Access denied to this project');
    }

    // Determine file type
    const fileType = this.getFileType(file.mimetype);

    const attachmentData = {
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      type: fileType,
      projectId: new Types.ObjectId(projectId),
      description,
      tags: tags || [],
      uploadedBy: new Types.ObjectId(userId),
      createdBy: new Types.ObjectId(userId),
    };

    const attachment = await super.create(attachmentData as any);

    // Create timeline event
    await this.createTimelineEvent({
      type: TimelineEventType.FILE_UPLOADED,
      title: `File uploaded: ${attachment.originalName}`,
      description: `File "${attachment.originalName}" was uploaded to the project`,
      projectId: new Types.ObjectId(projectId),
      userId: new Types.ObjectId(userId),
    });

    return attachment;
  }

  async findAllWithQuery(query: AttachmentQueryDto, userId: string) {
    const filter: FilterQuery<Attachment> = {};

    // Search functionality
    if (query.search) {
      filter.$or = [
        { originalName: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
      ];
    }

    // Type filter
    if (query.type) {
      filter.type = query.type;
    }

    // Project filter
    if (query.projectId) {
      filter.projectId = new Types.ObjectId(query.projectId);
    }

    // Uploaded by filter
    if (query.uploadedBy) {
      filter.uploadedBy = new Types.ObjectId(query.uploadedBy);
    }

    // User access control - only show attachments from projects where user is owner or member
    if (!query.projectId) {
      const userProjects = await this.projectModel
        .find({
          $or: [
            { owner: new Types.ObjectId(userId) },
            { members: { $in: [new Types.ObjectId(userId)] } },
          ],
        })
        .select('_id');

      filter.projectId = { $in: userProjects.map(p => p._id) };
    }

    const attachments = await this.findAll({
      ...filter,
      offset: query.offset,
      limit: query.limit,
      sortField: query.sortField as never,
      sortOrder: query.sortOrder,
      populate: ['uploadedBy', 'createdBy', 'updatedBy'],
    });

    const total = await this.countAll(filter);

    return {
      data: attachments,
      total,
      page: Math.floor((query.offset || 0) / (query.limit || 10)) + 1,
      limit: query.limit || 10,
    };
  }

  async deleteWithAccess(id: string, userId: string): Promise<void> {
    const attachment = await this.findById(id, [
      'projectId',
      'originalName',
      'path',
    ]);
    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }

    // Check project access
    const project = await this.projectModel.findById(attachment.projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (
      project.owner.toString() !== userId &&
      !project.members.includes(new Types.ObjectId(userId))
    ) {
      throw new ForbiddenException('Access denied to this attachment');
    }

    await super.remove(id);

    // Create timeline event for attachment deletion
    await this.createTimelineEvent({
      type: TimelineEventType.FILE_UPLOADED,
      title: `File deleted: ${attachment.originalName}`,
      description: `File "${attachment.originalName}" was deleted from the project`,
      projectId: new Types.ObjectId(project._id.toString()),
      userId: new Types.ObjectId(userId),
    });
  }

  async getAttachmentAndCheckAccess(
    id: string,
    userId: string,
  ): Promise<Attachment> {
    const attachment = await this.findById(id, [
      'projectId',
      'originalName',
      'path',
    ]);
    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }

    const project = await this.projectModel.findById(attachment.projectId);
    if (!project) {
      throw new NotFoundException(
        'The project associated with this attachment could not be found.',
      );
    }
    if (
      project.owner.toString() !== userId &&
      !project.members.includes(new Types.ObjectId(userId))
    ) {
      throw new ForbiddenException(
        'You do not have access to this attachment.',
      );
    }

    return attachment;
  }

  private getFileType(mimeType: string): AttachmentType {
    if (mimeType.startsWith('image/')) {
      return AttachmentType.IMAGE;
    } else if (mimeType.startsWith('video/')) {
      return AttachmentType.VIDEO;
    } else if (mimeType.startsWith('audio/')) {
      return AttachmentType.AUDIO;
    } else if (
      mimeType.includes('zip') ||
      mimeType.includes('rar') ||
      mimeType.includes('tar')
    ) {
      return AttachmentType.ARCHIVE;
    } else if (
      mimeType.includes('pdf') ||
      mimeType.includes('document') ||
      mimeType.includes('text')
    ) {
      return AttachmentType.DOCUMENT;
    } else {
      return AttachmentType.OTHER;
    }
  }

  private async createTimelineEvent(eventData: {
    type: TimelineEventType;
    title: string;
    description: string;
    projectId: Types.ObjectId;
    userId: Types.ObjectId;
  }) {
    await this.timelineEventModel.create({
      ...eventData,
      createdBy: eventData.userId,
    });
  }
}
