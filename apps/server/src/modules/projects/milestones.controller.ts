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
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { MilestoneQueryDto } from './dto/milestone-query.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { Milestone } from './entities/milestone.entity';
import { MilestonesService } from './milestones.service';

@ApiTags('Milestones')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('milestones')
export class MilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Post(':projectId')
  @ApiOperation({ summary: 'Create a new milestone for a project' })
  @ApiCreatedResponse({ type: Milestone })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @ApiForbiddenResponse({ description: 'Access denied to project' })
  async create(
    @Param('projectId') projectId: string,
    @Body() createMilestoneDto: CreateMilestoneDto,
    @CurrentUser() user: TokenPayload,
  ): Promise<Milestone> {
    return this.milestonesService.createMilestone(createMilestoneDto, projectId, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all milestones with filtering and pagination' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Milestone' },
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
    enum: ['Pending', 'InProgress', 'Completed', 'Delayed', 'Cancelled'],
  })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  @ApiQuery({ name: 'assignedTo', required: false, type: String })
  @ApiQuery({ name: 'dueDateFrom', required: false, type: String })
  @ApiQuery({ name: 'dueDateTo', required: false, type: String })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query() query: MilestoneQueryDto,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.milestonesService.findAllWithQuery(query, user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get milestone by ID' })
  @ApiOkResponse({ type: Milestone })
  @ApiNotFoundResponse({ description: 'Milestone not found' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<Milestone> {
    return this.milestonesService.findById(id, ['assignedTo', 'createdBy', 'updatedBy']);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update milestone by ID' })
  @ApiOkResponse({ type: Milestone })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @ApiNotFoundResponse({ description: 'Milestone not found' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  async update(
    @Param('id') id: string,
    @Body() updateMilestoneDto: UpdateMilestoneDto,
    @CurrentUser() user: TokenPayload,
  ): Promise<Milestone> {
    return this.milestonesService.updateWithAccess(id, updateMilestoneDto, user.sub, user.rol);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete milestone by ID' })
  @ApiOkResponse({ description: 'Milestone deleted successfully' })
  @ApiNotFoundResponse({ description: 'Milestone not found' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<{ message: string }> {
    await this.milestonesService.deleteWithAccess(id, user.sub);
    return { message: 'Milestone deleted successfully' };
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get all milestones for a specific project' })
  @ApiOkResponse({ type: [Milestone] })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @ApiForbiddenResponse({ description: 'Access denied to project' })
  async findByProject(
    @Param('projectId') projectId: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<Milestone[]> {
    const query: MilestoneQueryDto = { projectId };
    const result = await this.milestonesService.findAllWithQuery(query, user.sub);
    return result.data;
  }
} 