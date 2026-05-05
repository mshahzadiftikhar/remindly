import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reminder } from '../reminders/entities/reminder.entity';
import { UserSettings } from '../settings/entities/user-settings.entity';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reminder, UserSettings])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
