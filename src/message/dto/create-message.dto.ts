import { ApiProperty } from "@nestjs/swagger";

export class CreateMessageDto {
  @ApiProperty({
    description: 'ID of the user receiving the message',
    example: 2,
  })
  receiverId: number;

  @ApiProperty({
    description: 'Content of the message',
    example: 'Hello, how are you?',
  })
  content: string;
}
