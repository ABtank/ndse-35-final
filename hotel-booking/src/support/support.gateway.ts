import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SupportRequestService } from './support-request.service';
import { SendMessageDto } from './interfaces';

@WebSocketGateway({ cors: true })
export class SupportGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private readonly supportRequestService: SupportRequestService) {}

  handleConnection(client: any): void {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any): void {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() data: SendMessageDto) {
    const message = await this.supportRequestService.sendMessage(data);
    this.server.emit('newMessage', message);
    return message;
  }
}
