import { CreateMessageDto } from './create-message.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {}
