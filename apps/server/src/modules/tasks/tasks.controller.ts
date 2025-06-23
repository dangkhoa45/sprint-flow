import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { Task } from './entities/task.entity';
import { CurrentUser } from 'src/decorators/current-user.decor';
import { TokenPayload } from '../auth/dto/tokenPayload';
import { BadRequestResponse } from 'src/shared/base.dto';

@ApiTags('Tasks')
@Controller('tasks')
@ApiBearerAuth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    type: Task,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: BadRequestResponse,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - No permission to create task in this project',
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: TokenPayload,
  ): Promise<Task> {
    return this.tasksService.create(createTaskDto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term for title and description',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'CANCELLED'],
  })
  @ApiQuery({
    name: 'priority',
    required: false,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
  })
  @ApiQuery({
    name: 'projectId',
    required: false,
    description: 'Filter by project ID',
  })
  @ApiQuery({
    name: 'assignedTo',
    required: false,
    description: 'Filter by assigned user ID',
  })
  @ApiQuery({
    name: 'createdBy',
    required: false,
    description: 'Filter by creator user ID',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page',
    type: Number,
  })
  findAll(@Query() query: TaskQueryDto, @CurrentUser() user: TokenPayload) {
    return this.tasksService.findAll(query, user.sub);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get task statistics for current user' })
  @ApiResponse({
    status: 200,
    description: 'Task statistics retrieved successfully',
  })
  getStats(@CurrentUser() user: TokenPayload) {
    return this.tasksService.getTaskStats(user.sub);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get current user tasks' })
  @ApiResponse({
    status: 200,
    description: 'User tasks retrieved successfully',
    type: [Task],
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by task status',
  })
  findUserTasks(
    @Query('status') status: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<Task[]> {
    return this.tasksService.findUserTasks(user.sub, status);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get all tasks for a specific project' })
  @ApiResponse({
    status: 200,
    description: 'Project tasks retrieved successfully',
    type: [Task],
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - No permission to view tasks in this project',
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  findProjectTasks(
    @Param('projectId') projectId: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<Task[]> {
    return this.tasksService.findProjectTasks(projectId, user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific task by ID' })
  @ApiResponse({
    status: 200,
    description: 'Task retrieved successfully',
    type: Task,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - No permission to view this task',
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<Task> {
    return this.tasksService.findById(id, user.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific task' })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    type: Task,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: BadRequestResponse,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - No permission to update this task',
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: TokenPayload,
  ): Promise<Task> {
    return this.tasksService.update(id, updateTaskDto, user.sub);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specific task' })
  @ApiResponse({ status: 204, description: 'Task deleted successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - No permission to delete this task',
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<void> {
    return this.tasksService.remove(id, user.sub);
  }
}
