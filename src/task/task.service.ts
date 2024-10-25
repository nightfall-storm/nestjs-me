// src/task/task.service.ts
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto, TaskDto, TaskResponseDto, UpdateTaskDto } from './dto/task.dto';

@Injectable()
export class TaskService {
    constructor(private prisma: PrismaService) { }

    async createTask(dto: CreateTaskDto, userId: number): Promise<TaskResponseDto> {
        const task = await this.prisma.task.create({
            data: {
                title: dto.title,
                description: dto.description,
                userId, // Link task to the authenticated user
            },
        });
        return task;
    }

    async getTasks(userId: number): Promise<TaskResponseDto[]> {
        return this.prisma.task.findMany({
            where: { userId }, // Retrieve tasks for the authenticated user
        });
    }

    async getTaskById(id: number, userId: number): Promise<TaskDto> {
        const task = await this.prisma.task.findUnique({ where: { id } });

        // Check if task exists
        if (!task) {
            throw new NotFoundException('Task not found');
        }

        // Check if the task belongs to the user
        if (task.userId !== userId) {
            throw new ForbiddenException("You don't have permission to view this task");
        }

        return task;
    }

    async deleteTask(taskId: number, userId: number): Promise<boolean> {
        const task = await this.prisma.task.findUnique({ where: { id: taskId } });

        // Check if task exists
        if (!task) {
            throw new NotFoundException('Task not found');
        }

        // Check if the task belongs to the user
        if (task.userId !== userId) {
            throw new ForbiddenException("You don't have permission to delete this task");
        }

        await this.prisma.task.delete({ where: { id: taskId } });
        return true;
    }

    async updateTask(taskId: number, userId: number, dto: UpdateTaskDto) {
        const task = await this.prisma.task.findUnique({ where: { id: taskId } });

        // Check if task exists
        if (!task) {
            throw new NotFoundException('Task not found');
        }

        // Check if the task belongs to the user
        if (task.userId !== userId) {
            throw new ForbiddenException("You don't have permission to edit this task");
        }

        return this.prisma.task.update({
            where: { id: taskId },
            data: {
                ...dto,
                updatedAt: new Date(), // Optional: Explicitly set updated time
            },
        });
    }
}
