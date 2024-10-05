import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { User } from '../users/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Send a new message
  async sendMessage(senderId: number, createMessageDto: CreateMessageDto) {
    const sender = await this.userRepository.findOneBy({ id: senderId });
    const receiver = await this.userRepository.findOneBy({
      id: createMessageDto.receiverId,
    });

    if (!receiver) {
      throw new NotFoundException('Receiver not found');
    }

    const message = this.messageRepository.create({
      content: createMessageDto.content,
      sender,
      receiver,
    });

    return this.messageRepository.save(message);
  }

  // Get messages between two users
  async getMessagesBetweenUsers(senderId: number, receiverId: number) {
    return this.messageRepository.find({
      where: [
        { sender: { id: senderId }, receiver: { id: receiverId } },
        { sender: { id: receiverId }, receiver: { id: senderId } },
      ],
      order: { timestamp: 'ASC' },
    });
  }

  // Get the latest messages from each unique conversation for a user
  async getAllMessagesForUser(userId: number): Promise<Message[]> {
    return this.messageRepository
      .createQueryBuilder('message')
      .innerJoinAndSelect('message.sender', 'sender') // Include sender details
      .innerJoinAndSelect('message.receiver', 'receiver') // Include receiver details
      .where('message.receiverId = :userId OR message.senderId = :userId', {
        userId,
      })
      .distinctOn(['sender.id']) // Unique by sender
      .orderBy('sender.id', 'ASC') // Order by sender
      .addOrderBy('message.timestamp', 'DESC') // Latest message
      .getMany();
  }

  // Delete a message if authorized
  async deleteOne(userId: number, id: number): Promise<void> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['sender', 'receiver'],
    });

    if (!message) {
      throw new NotFoundException(`Message with id ${id} not found`);
    }

    // Check if the user is either the sender or receiver of the message
    if (message.sender.id !== userId && message.receiver.id !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this message',
      );
    }

    await this.messageRepository.delete(id);
  }

  // Update a message if the sender is authorized
  async updateOne(
    req: any,
    id: number,
    updateMessageDto: UpdateMessageDto,
  ): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['sender'], // Load the sender relationship
    });

    if (!message) {
      throw new NotFoundException(`Message with id ${id} not found`);
    }

    // Check if the logged-in user is the sender
    if (message.sender.id != req.user.id) {
      throw new UnauthorizedException();
    }

    await this.messageRepository.update(id, updateMessageDto);
    return await this.messageRepository.findOneBy({ id });
  }
}
