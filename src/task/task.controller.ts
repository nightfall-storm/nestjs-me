import { Body, Controller, Post, Get, UseGuards, Param, NotFoundException, Delete, Patch } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard';
import { TaskService } from './task.service';
import { CreateTaskDto, TaskDto, TaskResponseDto, UpdateTaskDto } from './dto/task.dto';
import { GetUser } from 'src/auth/decorator';
import { Task, User } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiBadRequestResponse } from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)  
@ApiBearerAuth()  
export class TaskController {
    constructor(private taskService: TaskService) { }

    @Post()
    @ApiCreatedResponse({ type: TaskResponseDto })
    @ApiBadRequestResponse({ description: 'Bad request, validation errors occurred.' }) // Add this line
    async createTask(@Body() dto: CreateTaskDto, @GetUser() user: User): Promise<TaskResponseDto> {
        return this.taskService.createTask(dto, user.id);
    }

    @Get()
    @ApiOkResponse({ type: [TaskResponseDto] })
    async getTasks(@GetUser() user: User): Promise<TaskResponseDto[]> {
        return this.taskService.getTasks(user.id);
    }

    @Get(':id')
    @ApiOkResponse({ type: TaskDto })
    @ApiNotFoundResponse({ description: 'Task not found' })
    @ApiBadRequestResponse({ description: 'Invalid ID format.' }) // Add this line
    async getTaskById(@Param('id') id: string, @GetUser('id') userId: number): Promise<TaskDto> {
        const task = await this.taskService.getTaskById(+id, userId);
        if (!task) {
            throw new NotFoundException('Task not found');
        }
        return task;
    }

    @Delete(':id')
    @ApiOkResponse({ description: 'Task deleted successfully' })
    @ApiNotFoundResponse({ description: 'Task not found' })
    async deleteTask(@Param('id') id: string, @GetUser('id') userId: number): Promise<string> {
        const deleted = await this.taskService.deleteTask(+id, userId);
        if (!deleted) {
            throw new NotFoundException('Task not found');
        }
        return 'Task deleted successfully';
    }

    @Patch(':id')
    @ApiOkResponse({ description: 'Task updated successfully', type: TaskDto })
    @ApiNotFoundResponse({ description: 'Task not found or unauthorized' })
    @ApiBadRequestResponse({ description: 'Bad request, validation errors occurred.' }) // Add this line
    async updateTask(
        @Param('id') id: string,
        @GetUser('id') userId: number,
        @Body() dto: UpdateTaskDto,
    ): Promise<Task> {
        const updatedTask = await this.taskService.updateTask(+id, userId, dto);
        return updatedTask;
    }
}
