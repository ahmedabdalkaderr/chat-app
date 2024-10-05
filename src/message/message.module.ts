import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from './message.service';
import { MessagesController } from './message.controller';
import { Message } from './message.entity';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module'; // Import UsersModule

@Module({
  imports: [TypeOrmModule.forFeature([Message, User]), UsersModule],
  providers: [MessagesService],
  controllers: [MessagesController],
  exports: [MessagesService],
})
export class MessageModule {}
