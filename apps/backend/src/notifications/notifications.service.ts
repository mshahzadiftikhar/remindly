import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reminder } from '../reminders/entities/reminder.entity';
import { UserSettings } from '../settings/entities/user-settings.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Reminder) private readonly reminders: Repository<Reminder>,
    @InjectRepository(UserSettings) private readonly settings: Repository<UserSettings>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async runDailyCheck() {
    this.logger.log('Running daily reminder check...');
    const count = await this.sendDueReminders();
    this.logger.log(`Daily check complete — ${count} email(s) queued`);
    return count;
  }

  async sendDueReminders(): Promise<number> {
    // Find all active reminders where today falls on a remind day:
    // expiry_date - CURRENT_DATE = ANY(remind_days_before)
    const due = await this.reminders
      .createQueryBuilder('r')
      .innerJoinAndSelect('r.user', 'u')
      .where('r.is_active = true')
      .andWhere(
        "r.expiry_date - CURRENT_DATE = ANY(r.remind_days_before)",
      )
      .getMany();

    let emailsSent = 0;

    for (const reminder of due) {
      const userSettings = await this.settings.findOne({
        where: { userId: reminder.userId },
      });
      const toEmail = userSettings?.notificationEmail ?? reminder.user.email;
      const daysLeft = this.daysUntil(reminder.expiryDate);

      await this.sendReminderEmail(toEmail, reminder.title, daysLeft);
      emailsSent++;
    }

    return emailsSent;
  }

  private async sendReminderEmail(
    to: string,
    title: string,
    daysLeft: number,
  ): Promise<void> {
    // TODO: integrate Resend SDK here
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'remindly@yourdomain.com',
    //   to,
    //   subject: `Reminder: "${title}" expires in ${daysLeft} day(s)`,
    //   html: `<p>Your item <strong>${title}</strong> expires in <strong>${daysLeft} day(s)</strong>. Take action before it's too late!</p>`,
    // });
    this.logger.log(`[TODO] Would email ${to}: "${title}" expires in ${daysLeft} day(s)`);
  }

  private daysUntil(expiryDate: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    return Math.round((expiry.getTime() - today.getTime()) / 86_400_000);
  }
}
