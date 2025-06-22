import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current-user.decor';
import { Roles } from 'src/decorators/roles.decor';
import { BadRequestResponse } from 'src/shared/base.dto';
import { TokenPayload } from '../auth/dto/tokenPayload';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectQueryDto, ProjectStatsDto } from './dto/project-query.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { ProjectsService } from './projects.service';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiCreatedResponse({ type: Project })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: TokenPayload,
  ): Promise<Project> {
    return this.projectsService.createProject(createProjectDto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects with filtering and pagination' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Project' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['Planning', 'InProgress', 'OnHold', 'Completed', 'Cancelled'],
  })
  @ApiQuery({
    name: 'priority',
    required: false,
    enum: ['Low', 'Medium', 'High', 'Critical'],
  })
  @ApiQuery({ name: 'owner', required: false, type: String })
  @ApiQuery({ name: 'member', required: false, type: String })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query() query: ProjectQueryDto,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.projectsService.findAllWithQuery(query, user.sub);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get project statistics for current user' })
  @ApiOkResponse({ type: ProjectStatsDto })
  async getStats(@CurrentUser() user: TokenPayload): Promise<ProjectStatsDto> {
    return this.projectsService.getProjectStats(user.sub);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent projects for current user' })
  @ApiOkResponse({ type: [Project] })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getRecent(
    @Query('limit') limit = 5,
    @CurrentUser() user: TokenPayload,
  ): Promise<Project[]> {
    return this.projectsService.getRecentProjects(user.sub, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiOkResponse({ type: Project })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<Project> {
    return this.projectsService.findByIdWithAccess(id, user.sub, user.rol);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update project by ID' })
  @ApiOkResponse({ type: Project })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @ApiForbiddenResponse({ description: 'Only project owner can update' })
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @CurrentUser() user: TokenPayload,
  ): Promise<Project> {
    return this.projectsService.updateWithAccess(
      id,
      updateProjectDto,
      user.sub,
      user.rol,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project by ID (soft delete)' })
  @ApiOkResponse({ description: 'Project deleted successfully' })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @ApiForbiddenResponse({ description: 'Only project owner can delete' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<{ message: string }> {
    await this.projectsService.deleteWithAccess(id, user.sub);
    return { message: 'Project deleted successfully' };
  }

  @Post(':id/members/:memberId')
  @ApiOperation({ summary: 'Add member to project' })
  @ApiOkResponse({ type: Project })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @ApiForbiddenResponse({ description: 'Only project owner can add members' })
  async addMember(
    @Param('id') projectId: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<Project> {
    return this.projectsService.addMember(projectId, memberId, user.sub);
  }

  @Delete(':id/members/:memberId')
  @ApiOperation({ summary: 'Remove member from project' })
  @ApiOkResponse({ type: Project })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @ApiForbiddenResponse({
    description: 'Only project owner can remove members',
  })
  async removeMember(
    @Param('id') projectId: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<Project> {
    return this.projectsService.removeMember(projectId, memberId, user.sub);
  }

  // Admin only endpoints
  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Get all projects (Admin only)' })
  @ApiOkResponse({ type: [Project] })
  async findAllForAdmin(@Query() query: ProjectQueryDto) {
    return this.projectsService.findAllForAdmin(query);
  }

  @Delete('admin/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Hard delete project (Admin only)' })
  @ApiOkResponse({ description: 'Project permanently deleted' })
  async hardDelete(@Param('id') id: string): Promise<{ message: string }> {
    await this.projectsService.remove(id);
    return { message: 'Project permanently deleted' };
  }
}
