import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SupportRequest,
  SupportRequestDocument,
} from './support-request.schema';
import { Message, MessageDocument } from './message.schema';
import {
  CreateSupportRequestDto,
  SendMessageDto,
  MarkMessagesAsReadDto,
  ISupportRequestClientService,
  ISupportRequestEmployeeService,
  GetChatListParams,
} from './interfaces';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class SupportRequestService
  implements ISupportRequestClientService, ISupportRequestEmployeeService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private readonly supportRequestModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    private readonly eventEmitter: EventEmitter2, // Используем EventEmitter2
  ) {}
  closeRequest(supportRequest: string): Promise<void> {
    // TODO пока так
    console.log(supportRequest);
    throw new Error('Method not implemented.');
  }

  async createSupportRequest(
    data: CreateSupportRequestDto,
  ): Promise<SupportRequest> {
    const supportRequest = new this.supportRequestModel({
      user: data.user,
      messages: [],
      isActive: true,
    });
    const savedRequest = await supportRequest.save();

    // Отправка сообщения сразу при создании запроса
    const message = new this.messageModel({
      author: data.user,
      text: data.text,
    });
    savedRequest.messages.push(message);
    await savedRequest.save();

    this.eventEmitter.emit(
      'support-request.new_message',
      savedRequest,
      message,
    ); // Используем EventEmitter2

    return savedRequest;
  }

  async sendMessage(data: SendMessageDto): Promise<Message> {
    const supportRequest = await this.supportRequestModel.findById(
      data.supportRequest,
    );
    if (!supportRequest) {
      throw new Error('Support request not found');
    }

    const message = new this.messageModel({
      author: data.author,
      text: data.text,
    });

    supportRequest.messages.push(message);
    await supportRequest.save();

    this.eventEmitter.emit(
      'support-request.new_message',
      supportRequest,
      message,
    ); // Используем EventEmitter2

    return message;
  }

  async markMessagesAsRead(params: MarkMessagesAsReadDto): Promise<void> {
    const supportRequest = await this.supportRequestModel.findById(
      params.supportRequest,
    );
    if (!supportRequest) {
      throw new Error('Support request not found');
    }

    const messages = supportRequest.messages.filter(
      (msg) => msg.author !== params.user && !msg.readAt,
    );

    messages.forEach((msg) => {
      msg.readAt = new Date();
    });

    await supportRequest.save();
  }

  async getUnreadCount(supportRequest: string): Promise<number> {
    const req = await this.supportRequestModel.findById(supportRequest);
    return req.messages.filter((msg) => !msg.readAt).length;
  }

  findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]> {
    return this.supportRequestModel
      .find({ user: params.user, isActive: params.isActive })
      .exec();
  }

  async getMessages(supportRequest: string): Promise<Message[]> {
    const req = await this.supportRequestModel.findById(supportRequest);
    return req.messages;
  }

  subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ): () => void {
    this.eventEmitter.on('support-request.new_message', handler);
    return () => {
      this.eventEmitter.off('support-request.new_message', handler);
    };
  }
}
