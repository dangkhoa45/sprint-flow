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
import { ProjectExportService } from './project-export.service';
import { TimelineVisualizationService } from './timeline-visualization.service';
import { ExportProjectsDto } from './dto/export-projects.dto';
import {
  ManageProjectDependenciesDto,
  UpdateResourceAllocationDto,
} from './dto/project-dependencies.dto';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly projectExportService: ProjectExportService,
    private readonly timelineVisualizationService: TimelineVisualizationService,
  ) {}

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

  @Get('analytics')
  @ApiOperation({ summary: 'Get advanced project analytics for current user' })
  @ApiOkResponse({ description: 'Advanced project analytics' })
  async getAdvancedStats(@CurrentUser() user: TokenPayload) {
    return this.projectsService.getAdvancedProjectStats(user.sub);
  }

  @Post('export')
  @ApiOperation({ summary: 'Export projects data in various formats' })
  @ApiCreatedResponse({ description: 'Export file generated successfully' })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  async exportProjects(
    @Body() exportDto: ExportProjectsDto,
    @CurrentUser() user: TokenPayload,
  ) {
    const result = await this.projectExportService.exportProjects(
      exportDto,
      user.sub,
    );
    return {
      filename: result.filename,
      downloadUrl: `/api/projects/download/${result.filename}`,
      fileSize: result.fileSize,
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    };
  }

  @Post(':id/dependencies')
  @ApiOperation({ summary: 'Manage project dependencies' })
  @ApiOkResponse({ type: Project })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiNotFoundResponse({ description: 'Project not found' })
  async manageDependencies(
    @Param('id') projectId: string,
    @Body() dependenciesDto: ManageProjectDependenciesDto,
    @CurrentUser() user: TokenPayload,
  ): Promise<Project> {
    return this.projectsService.manageDependencies(
      projectId,
      dependenciesDto.dependencies,
      user.sub,
    );
  }

  @Get(':id/dependencies/analysis')
  @ApiOperation({ summary: 'Get project dependency analysis' })
  @ApiOkResponse({ description: 'Project dependency analysis' })
  @ApiNotFoundResponse({ description: 'Project not found' })
  async getDependencyAnalysis(
    @Param('id') projectId: string,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.projectsService.getDependencyAnalysis(projectId, user.sub);
  }

  @Put(':id/resource-allocation')
  @ApiOperation({ summary: 'Update project resource allocation' })
  @ApiOkResponse({ type: Project })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiNotFoundResponse({ description: 'Project not found' })
  async updateResourceAllocation(
    @Param('id') projectId: string,
    @Body() resourceDto: UpdateResourceAllocationDto,
    @CurrentUser() user: TokenPayload,
  ): Promise<Project> {
    return this.projectsService.updateResourceAllocation(
      projectId,
      resourceDto.resourceAllocation,
      user.sub,
    );
  }

  @Get(':id/resource-allocation')
  @ApiOperation({ summary: 'Get project resource allocation' })
  @ApiOkResponse({ description: 'Project resource allocation' })
  @ApiNotFoundResponse({ description: 'Project not found' })
  async getResourceAllocation(
    @Param('id') projectId: string,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.projectsService.getResourceAllocation(projectId, user.sub);
  }

  @Get('resource-utilization')
  @ApiOperation({ summary: 'Get resource utilization summary' })
  @ApiOkResponse({ description: 'Resource utilization summary' })
  async getResourceUtilization(@CurrentUser() user: TokenPayload) {
    return this.projectsService.getResourceUtilization(user.sub);
  }

  @Get('timeline/visualization')
  @ApiOperation({ summary: 'Get timeline visualization data' })
  @ApiOkResponse({ description: 'Timeline visualization data' })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiQuery({ name: 'projectIds', required: false, type: [String] })
  async getTimelineVisualization(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('projectIds') projectIds?: string[],
    @CurrentUser() user: TokenPayload,
  ) {
    return this.timelineVisualizationService.getTimelineVisualization(
      user.sub,
      dateFrom ? new Date(dateFrom) : undefined,
      dateTo ? new Date(dateTo) : undefined,
      projectIds,
    );
  }

  @Get('timeline/stats')
  @ApiOperation({ summary: 'Get timeline statistics' })
  @ApiOkResponse({ description: 'Timeline statistics' })
  async getTimelineStats(@CurrentUser() user: TokenPayload) {
    return this.timelineVisualizationService.getTimelineStats(user.sub);
  }

  @Get(':id/timeline')
  @ApiOperation({ summary: 'Get project timeline' })
  @ApiOkResponse({ description: 'Project timeline data' })
  @ApiNotFoundResponse({ description: 'Project not found' })
  async getProjectTimeline(
    @Param('id') projectId: string,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.timelineVisualizationService.getProjectTimeline(
      projectId,
      user.sub,
    );
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
