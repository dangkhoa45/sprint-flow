import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { TokenPayload } from 'src/modules/auth/auth.types';
import { BadRequestResponse } from 'src/shared/responses.dto';
import { ProjectTemplateService } from './project-template.service';
import { ProjectTemplate } from './entities/project-template.entity';
import {
  CreateProjectTemplateDto,
  UpdateProjectTemplateDto,
  RateTemplateDto,
} from './dto/create-project-template.dto';
import {
  ProjectTemplateQueryDto,
  CreateProjectFromTemplateDto,
} from './dto/project-template-query.dto';

@ApiTags('Project Templates')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('project-templates')
export class ProjectTemplateController {
  constructor(private readonly templateService: ProjectTemplateService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project template' })
  @ApiCreatedResponse({ type: ProjectTemplate })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  async create(
    @Body() createTemplateDto: CreateProjectTemplateDto,
    @CurrentUser() user: TokenPayload,
  ): Promise<ProjectTemplate> {
    return this.templateService.createTemplate(createTemplateDto, user.sub);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all project templates with filtering and pagination',
  })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/ProjectTemplate' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  async findAll(
    @Query() query: ProjectTemplateQueryDto,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.templateService.findAllWithQuery(query, user.sub);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular project templates' })
  @ApiOkResponse({ type: [ProjectTemplate] })
  async getPopular() {
    return this.templateService.getPopularTemplates();
  }

  @Get('default')
  @ApiOperation({ summary: 'Get default project templates' })
  @ApiOkResponse({ type: [ProjectTemplate] })
  async getDefault() {
    return this.templateService.getDefaultTemplates();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project template by ID' })
  @ApiOkResponse({ type: ProjectTemplate })
  @ApiNotFoundResponse({ description: 'Template not found' })
  @ApiForbiddenResponse({ description: 'Template is not accessible' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<ProjectTemplate> {
    return this.templateService.getTemplateById(id, user.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project template' })
  @ApiOkResponse({ type: ProjectTemplate })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiNotFoundResponse({ description: 'Template not found' })
  @ApiForbiddenResponse({
    description: 'You can only update your own templates',
  })
  async update(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateProjectTemplateDto,
    @CurrentUser() user: TokenPayload,
  ): Promise<ProjectTemplate> {
    return this.templateService.updateTemplate(id, updateTemplateDto, user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project template' })
  @ApiOkResponse({ description: 'Template deleted successfully' })
  @ApiNotFoundResponse({ description: 'Template not found' })
  @ApiForbiddenResponse({
    description: 'You can only delete your own templates',
  })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<{ message: string }> {
    await this.templateService.deleteTemplate(id, user.sub);
    return { message: 'Template deleted successfully' };
  }

  @Post(':id/rate')
  @ApiOperation({ summary: 'Rate a project template' })
  @ApiOkResponse({ type: ProjectTemplate })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiNotFoundResponse({ description: 'Template not found' })
  async rate(
    @Param('id') id: string,
    @Body() rateDto: RateTemplateDto,
    @CurrentUser() user: TokenPayload,
  ): Promise<ProjectTemplate> {
    return this.templateService.rateTemplate(id, rateDto, user.sub);
  }

  @Post(':id/create-project')
  @ApiOperation({ summary: 'Create a new project from template' })
  @ApiCreatedResponse({ description: 'Project created from template' })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiNotFoundResponse({ description: 'Template not found' })
  @ApiForbiddenResponse({ description: 'Template is not accessible' })
  async createProjectFromTemplate(
    @Param('id') id: string,
    @Body() createDto: CreateProjectFromTemplateDto,
    @CurrentUser() user: TokenPayload,
  ) {
    createDto.templateId = id;
    return this.templateService.createProjectFromTemplate(createDto, user.sub);
  }
}
