// src/user/dto/user.dto.ts
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UserDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    email: string;

    @ApiProperty({ type: String, example: '2024-10-24T10:00:00.000Z' })
    createdAt: Date;

    @ApiProperty({ type: String, example: '2024-10-24T10:00:00.000Z' })
    updatedAt: Date;

    @ApiPropertyOptional({ 
        description: 'First name of the user, can be null.' 
    })
    firstName?: string | null;

    @ApiPropertyOptional({ 
        description: 'Last name of the user, can be null.' 
    })
    lastName?: string | null;
}
