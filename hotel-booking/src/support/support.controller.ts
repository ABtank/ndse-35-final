import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { SupportRequestService } from './support-request.service';
import { CreateSupportRequestDto, MarkMessagesAsReadDto } from './interfaces';
import { SupportRequest } from './support-request.schema';
import { Message } from './message.schema';

@Controller('api/client/support-requests')
export class SupportRequestController {
  constructor(private readonly supportRequestService: SupportRequestService) {}

  @Post()
  async createSupportRequest(
    @Body() data: CreateSupportRequestDto,
  ): Promise<SupportRequest> {
    return this.supportRequestService.createSupportRequest(data);
  }

  @Post(':id/messages')
  async sendMessage(
    @Param('id') supportRequestId: string,
    @Body() data: { author: string; text: string },
  ): Promise<Message> {
    return this.supportRequestService.sendMessage({
      ...data,
      supportRequest: supportRequestId,
    });
  }

  @Post(':id/messages/read')
  async markMessagesAsRead(
    @Param('id') supportRequestId: string,
    @Body() params: MarkMessagesAsReadDto,
  ): Promise<void> {
    return this.supportRequestService.markMessagesAsRead({
      ...params,
      supportRequest: supportRequestId,
    });
  }

  @Get()
  async getSupportRequests(
    @Query() params: { user: string | null; isActive: boolean },
  ): Promise<SupportRequest[]> {
    return this.supportRequestService.findSupportRequests(params);
  }

  @Get(':id/messages')
  async getMessages(@Param('id') supportRequestId: string): Promise<Message[]> {
    return this.supportRequestService.getMessages(supportRequestId);
  }
}
