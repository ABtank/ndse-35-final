import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SupportRequestService } from './support-request.service';
import { SupportRequestController } from './support.controller';
import { SupportRequest, SupportRequestSchema } from './support-request.schema';
import { Message, MessageSchema } from './message.schema';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema },
    ]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    EventEmitterModule.forRoot(), // Инициализируем EventEmitterModule
  ],
  controllers: [SupportRequestController],
  providers: [SupportRequestService],
})
export class SupportModule {}
