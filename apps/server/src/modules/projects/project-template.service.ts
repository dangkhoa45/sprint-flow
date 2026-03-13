import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseService } from 'src/shared/base.service';
import {
  ProjectTemplate,
  ProjectTemplateDocument,
} from './entities/project-template.entity';
import {
  CreateProjectTemplateDto,
  UpdateProjectTemplateDto,
  RateTemplateDto,
} from './dto/create-project-template.dto';
import {
  ProjectTemplateQueryDto,
  CreateProjectFromTemplateDto,
} from './dto/project-template-query.dto';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectTemplateService extends BaseService<
  ProjectTemplate,
  CreateProjectTemplateDto,
  UpdateProjectTemplateDto
> {
  constructor(
    @InjectModel(ProjectTemplate.name)
    private projectTemplateModel: Model<ProjectTemplateDocument>,
    private projectsService: ProjectsService,
  ) {
    super(projectTemplateModel);
  }

  async createTemplate(
    createTemplateDto: CreateProjectTemplateDto,
    userId: string,
  ): Promise<ProjectTemplate> {
    const template = new this.projectTemplateModel({
      ...createTemplateDto,
      createdBy: new Types.ObjectId(userId),
    });
    return template.save();
  }

  async findAllWithQuery(query: ProjectTemplateQueryDto, userId: string) {
    const { myTemplates, ...filterQuery } = query;

    let baseFilter = filterQuery;

    if (myTemplates) {
      baseFilter = { ...baseFilter, createdBy: userId };
    } else {
      // For public templates, show public ones + user's own templates
      baseFilter = {
        ...baseFilter,
        $or: [{ isPublic: true }, { createdBy: new Types.ObjectId(userId) }],
      };
    }

    const result = await this.findAll(baseFilter);
    const total = await this.countAll(baseFilter);

    return {
      data: result,
      total,
      page: Math.floor((query.offset || 0) / (query.limit || 10)) + 1,
      limit: query.limit || 10,
    };
  }

  async getPopularTemplates(limit = 10): Promise<ProjectTemplate[]> {
    return this.projectTemplateModel
      .find({ isPublic: true })
      .sort({ usageCount: -1, rating: -1 })
      .limit(limit)
      .populate('createdBy', 'username displayName avatar')
      .exec();
  }

  async getDefaultTemplates(): Promise<ProjectTemplate[]> {
    return this.projectTemplateModel
      .find({ isDefault: true })
      .populate('createdBy', 'username displayName avatar')
      .exec();
  }

  async updateTemplate(
    id: string,
    updateTemplateDto: UpdateProjectTemplateDto,
    userId: string,
  ): Promise<ProjectTemplate> {
    const template = await this.projectTemplateModel.findById(id);

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    // Check if user owns the template
    if (template.createdBy.toString() !== userId) {
      throw new ForbiddenException('You can only update your own templates');
    }

    Object.assign(template, updateTemplateDto);
    return template.save();
  }

  async deleteTemplate(id: string, userId: string): Promise<void> {
    const template = await this.projectTemplateModel.findById(id);

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    // Check if user owns the template
    if (template.createdBy.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own templates');
    }

    await this.projectTemplateModel.findByIdAndDelete(id);
  }

  async rateTemplate(
    id: string,
    rateDto: RateTemplateDto,
    _userId: string,
  ): Promise<ProjectTemplate> {
    const template = await this.projectTemplateModel.findById(id);

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    // Calculate new rating
    const newRatingCount = template.ratingCount + 1;
    const newRating =
      (template.rating * template.ratingCount + rateDto.rating) /
      newRatingCount;

    template.rating = Math.round(newRating * 10) / 10; // Round to 1 decimal
    template.ratingCount = newRatingCount;

    return template.save();
  }

  async createProjectFromTemplate(
    createDto: CreateProjectFromTemplateDto,
    userId: string,
  ): Promise<any> {
    const template = await this.projectTemplateModel.findById(
      createDto.templateId,
    );

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    // Check if template is accessible to user
    if (!template.isPublic && template.createdBy.toString() !== userId) {
      throw new ForbiddenException('Template is not accessible');
    }

    // Create project from template
    const projectData: CreateProjectDto = {
      name: createDto.name,
      description: createDto.description || template.description,
      priority: template.defaultPriority,
      estimatedHours: template.defaultEstimatedHours,
      tags: template.defaultTags || [],
      metadata: template.defaultMetadata,
      members: createDto.members,
      startDate: createDto.startDate,
      endDate: createDto.endDate,
    };

    const project = await this.projectsService.createProject(
      projectData,
      userId,
    );

    // Increment usage count
    await this.projectTemplateModel.findByIdAndUpdate(createDto.templateId, {
      $inc: { usageCount: 1 },
    });

    return project;
  }

  async getTemplateById(id: string, userId: string): Promise<ProjectTemplate> {
    const template = await this.projectTemplateModel
      .findById(id)
      .populate('createdBy', 'username displayName avatar')
      .exec();

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    // Check if template is accessible to user
    if (!template.isPublic && template.createdBy.toString() !== userId) {
      throw new ForbiddenException('Template is not accessible');
    }

    return template;
  }
}
