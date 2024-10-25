// src/task/dto/task.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
    @ApiPropertyOptional({ example: 'Updated Task Title' })
    @IsOptional()
    @IsString({ message: 'Title must be a string' })
    title?: string;

    @ApiPropertyOptional({ example: 'Updated task description' })
    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    description?: string;
}

export class CreateTaskDto {
    @ApiProperty({ example: 'Task Title' })
    @IsString({ message: 'Title must be a string' })
    @IsNotEmpty({ message: 'Title is required' })
    title: string;

    @ApiProperty({ example: 'Task Description' })
    @IsString({ message: 'Description must be a string' })
    @IsNotEmpty({ message: 'Description is required' })
    description: string;

    // Optionally, you can add other fields like 'dueDate', 'status', etc.
}

export class TaskResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    userId: number; // Assuming each task is linked to a user
}

export class TaskDto {
    @ApiProperty()
    id: number;
  
    @ApiProperty()
    title: string;
  
    @ApiProperty()
    description: string;
  
    @ApiProperty()
    userId: number;
  
    @ApiProperty({ type: String, example: '2024-10-24T10:00:00.000Z' })
    createdAt: Date;
  
    @ApiProperty({ type: String, example: '2024-10-24T10:00:00.000Z' })
    updatedAt: Date;
}
