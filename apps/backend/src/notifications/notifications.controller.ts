import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('trigger')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async trigger() {
    const emailsSent = await this.notificationsService.sendDueReminders();
    return { message: 'Reminder check complete', emailsSent };
  }
}
