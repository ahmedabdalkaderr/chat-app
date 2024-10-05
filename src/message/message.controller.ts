import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  Request,
  ParseIntPipe,
  Delete,
  Patch,
} from '@nestjs/common';
import { MessagesService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Messages')
@UseGuards(AuthGuard)
@ApiBearerAuth() // Add this to indicate that authentication is needed via bearer token
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @ApiOperation({ summary: 'Send a message to another user' })
  @ApiResponse({ status: 201, description: 'Message successfully sent.' })
  @ApiResponse({ status: 404, description: 'Receiver not found.' })
  @Post()
  sendMessage(@Request() req, @Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.sendMessage(req.user.id, createMessageDto);
  }

  @ApiOperation({ summary: 'Get all messages between two users' })
  @ApiResponse({
    status: 200,
    description: 'Messages successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'No messages found.' })
  @Get(':receiverId')
  getMessages(
    @Request() req,
    @Param('receiverId', ParseIntPipe) receiverId: number,
  ) {
    return this.messagesService.getMessagesBetweenUsers(
      req.user.id,
      receiverId,
    );
  }

  @ApiOperation({
    summary: 'Get all unique conversations of the logged-in user',
  })
  @ApiResponse({
    status: 200,
    description: 'Conversations successfully retrieved.',
  })
  @Get()
  getAllMessages(@Request() req) {
    return this.messagesService.getAllMessagesForUser(req.user.id);
  }

  @ApiOperation({ summary: 'Delete a message by its ID' })
  @ApiResponse({ status: 200, description: 'Message successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Message not found.' })
  @ApiResponse({
    status: 403,
    description: 'Not authorized to delete the message.',
  })
  @Delete(':messageId')
  deleteMessage(@Request() req, @Param('messageId', ParseIntPipe) id: number) {
    return this.messagesService.deleteOne(req.user.id, id);
  }

  @ApiOperation({ summary: 'Update a message by its ID' })
  @ApiResponse({ status: 200, description: 'Message successfully updated.' })
  @ApiResponse({ status: 404, description: 'Message not found.' })
  @ApiResponse({
    status: 403,
    description: 'Not authorized to update the message.',
  })
  @Patch(':id')
  updateOne(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    return this.messagesService.updateOne(req, id, updateMessageDto);
  }
}
