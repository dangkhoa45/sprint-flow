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
import { TaskTemplateService } from './task-template.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { CreateTaskTemplateDto } from './dto/create-task-template.dto';
import { UpdateTaskTemplateDto } from './dto/update-task-template.dto';
import { TaskTemplateQueryDto } from './dto/task-template-query.dto';
import { CreateTaskFromTemplateDto, BulkUpdateTaskDto, BulkDeleteTaskDto } from './dto/bulk-operations.dto';
import { CreateTaskCommentDto, UpdateTaskCommentDto } from './dto/task-comment.dto';
import { CreateTimeEntryDto, UpdateTimeEntryDto } from './dto/time-entry.dto';
import { Task } from './entities/task.entity';
import { TaskTemplate } from './entities/task-template.entity';
import { TaskComment } from './entities/task-comment.entity';
import { TimeEntry } from './entities/time-entry.entity';
import { Attachment } from '../projects/entities/attachment.entity';
import { CurrentUser } from 'src/decorators/current-user.decor';
import { TokenPayload } from '../auth/dto/tokenPayload';
import { BadRequestResponse } from 'src/shared/base.dto';

@ApiTags('Tasks')
@Controller('tasks')
@ApiBearerAuth()
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly taskTemplateService: TaskTemplateService,
  ) {}

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

  // Task Templates
  @Post('templates')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new task template' })
  @ApiResponse({
    status: 201,
    description: 'Task template created successfully',
    type: TaskTemplate,
  })
  createTemplate(
    @Body() createTaskTemplateDto: CreateTaskTemplateDto,
    @CurrentUser() user: TokenPayload,
  ): Promise<TaskTemplate> {
    return this.taskTemplateService.createTemplate(createTaskTemplateDto, user.sub);
  }

  @Get('templates')
  @ApiOperation({ summary: 'Get all task templates' })
  @ApiResponse({
    status: 200,
    description: 'Task templates retrieved successfully',
  })
  findAllTemplates(
    @Query() query: TaskTemplateQueryDto,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.taskTemplateService.findAllTemplates(query, user.sub);
  }

  @Get('templates/:id')
  @ApiOperation({ summary: 'Get a specific task template by ID' })
  @ApiResponse({
    status: 200,
    description: 'Task template retrieved successfully',
    type: TaskTemplate,
  })
  findTemplate(
    @Param('id') id: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<TaskTemplate> {
    return this.taskTemplateService.findTemplateById(id, user.sub);
  }

  @Patch('templates/:id')
  @ApiOperation({ summary: 'Update a specific task template' })
  @ApiResponse({
    status: 200,
    description: 'Task template updated successfully',
    type: TaskTemplate,
  })
  updateTemplate(
    @Param('id') id: string,
    @Body() updateTaskTemplateDto: UpdateTaskTemplateDto,
    @CurrentUser() user: TokenPayload,
  ): Promise<TaskTemplate> {
    return this.taskTemplateService.updateTemplate(id, updateTaskTemplateDto, user.sub);
  }

  @Delete('templates/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specific task template' })
  @ApiResponse({ status: 204, description: 'Task template deleted successfully' })
  removeTemplate(
    @Param('id') id: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<void> {
    return this.taskTemplateService.deleteTemplate(id, user.sub);
  }

  @Post('from-template')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a task from template' })
  @ApiResponse({
    status: 201,
    description: 'Task created from template successfully',
    type: Task,
  })
  createFromTemplate(
    @Body() createTaskFromTemplateDto: CreateTaskFromTemplateDto,
    @CurrentUser() user: TokenPayload,
  ): Promise<Task> {
    return this.tasksService.createTaskFromTemplate(createTaskFromTemplateDto, user.sub);
  }

  // Bulk Operations
  @Post('bulk-update')
  @ApiOperation({ summary: 'Update multiple tasks' })
  @ApiResponse({
    status: 200,
    description: 'Tasks updated successfully',
  })
  bulkUpdate(
    @Body() bulkUpdateDto: BulkUpdateTaskDto,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.tasksService.bulkUpdateTasks(bulkUpdateDto, user.sub);
  }

  @Post('bulk-delete')
  @ApiOperation({ summary: 'Delete multiple tasks' })
  @ApiResponse({
    status: 200,
    description: 'Tasks deleted successfully',
  })
  bulkDelete(
    @Body() bulkDeleteDto: BulkDeleteTaskDto,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.tasksService.bulkDeleteTasks(bulkDeleteDto, user.sub);
  }

  // Task Comments
  @Post('comments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new task comment' })
  @ApiResponse({
    status: 201,
    description: 'Task comment created successfully',
    type: TaskComment,
  })
  createComment(
    @Body() createCommentDto: CreateTaskCommentDto,
    @CurrentUser() user: TokenPayload,
  ): Promise<TaskComment> {
    return this.tasksService.createComment(createCommentDto, user.sub);
  }

  @Get(':taskId/comments')
  @ApiOperation({ summary: 'Get all comments for a task' })
  @ApiResponse({
    status: 200,
    description: 'Task comments retrieved successfully',
    type: [TaskComment],
  })
  getTaskComments(
    @Param('taskId') taskId: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<TaskComment[]> {
    return this.tasksService.getTaskComments(taskId, user.sub);
  }

  @Patch('comments/:commentId')
  @ApiOperation({ summary: 'Update a task comment' })
  @ApiResponse({
    status: 200,
    description: 'Task comment updated successfully',
    type: TaskComment,
  })
  updateComment(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateTaskCommentDto,
    @CurrentUser() user: TokenPayload,
  ): Promise<TaskComment> {
    return this.tasksService.updateComment(commentId, updateCommentDto, user.sub);
  }

  @Delete('comments/:commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a task comment' })
  @ApiResponse({ status: 204, description: 'Task comment deleted successfully' })
  deleteComment(
    @Param('commentId') commentId: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<void> {
    return this.tasksService.deleteComment(commentId, user.sub);
  }

  // Time Entries
  @Post('time-entries')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new time entry' })
  @ApiResponse({
    status: 201,
    description: 'Time entry created successfully',
    type: TimeEntry,
  })
  createTimeEntry(
    @Body() createTimeEntryDto: CreateTimeEntryDto,
    @CurrentUser() user: TokenPayload,
  ): Promise<TimeEntry> {
    return this.tasksService.createTimeEntry(createTimeEntryDto, user.sub);
  }

  @Get(':taskId/time-entries')
  @ApiOperation({ summary: 'Get all time entries for a task' })
  @ApiResponse({
    status: 200,
    description: 'Time entries retrieved successfully',
    type: [TimeEntry],
  })
  getTaskTimeEntries(
    @Param('taskId') taskId: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<TimeEntry[]> {
    return this.tasksService.getTaskTimeEntries(taskId, user.sub);
  }

  @Patch('time-entries/:timeEntryId')
  @ApiOperation({ summary: 'Update a time entry' })
  @ApiResponse({
    status: 200,
    description: 'Time entry updated successfully',
    type: TimeEntry,
  })
  updateTimeEntry(
    @Param('timeEntryId') timeEntryId: string,
    @Body() updateTimeEntryDto: UpdateTimeEntryDto,
    @CurrentUser() user: TokenPayload,
  ): Promise<TimeEntry> {
    return this.tasksService.updateTimeEntry(timeEntryId, updateTimeEntryDto, user.sub);
  }

  @Delete('time-entries/:timeEntryId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a time entry' })
  @ApiResponse({ status: 204, description: 'Time entry deleted successfully' })
  deleteTimeEntry(
    @Param('timeEntryId') timeEntryId: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<void> {
    return this.tasksService.deleteTimeEntry(timeEntryId, user.sub);
  }

  @Get(':taskId/time-stats')
  @ApiOperation({ summary: 'Get time tracking statistics for a task' })
  @ApiResponse({
    status: 200,
    description: 'Time tracking statistics retrieved successfully',
  })
  getTimeTrackingStats(
    @Param('taskId') taskId: string,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.tasksService.getTimeTrackingStats(taskId, user.sub);
  }

  // Task Attachments
  @Get(':taskId/attachments')
  @ApiOperation({ summary: 'Get all attachments for a task' })
  @ApiResponse({
    status: 200,
    description: 'Task attachments retrieved successfully',
    type: [Attachment],
  })
  getTaskAttachments(
    @Param('taskId') taskId: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<Attachment[]> {
    return this.tasksService.getTaskAttachments(taskId, user.sub);
  }

  @Delete('attachments/:attachmentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a task attachment' })
  @ApiResponse({ status: 204, description: 'Task attachment deleted successfully' })
  deleteTaskAttachment(
    @Param('attachmentId') attachmentId: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<void> {
    return this.tasksService.deleteTaskAttachment(attachmentId, user.sub);
  }
}
