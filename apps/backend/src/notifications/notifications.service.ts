import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Resend } from 'resend';
import { Repository } from 'typeorm';
import { Reminder } from '../reminders/entities/reminder.entity';
import { UserSettings } from '../settings/entities/user-settings.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly resend: Resend | null;

  constructor(
    @InjectRepository(Reminder) private readonly reminders: Repository<Reminder>,
    @InjectRepository(UserSettings) private readonly settings: Repository<UserSettings>,
    private readonly config: ConfigService,
  ) {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    if (apiKey) {
      this.resend = new Resend(apiKey);
    } else {
      this.resend = null;
      this.logger.warn('RESEND_API_KEY is not set — email sending is disabled');
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async runDailyCheck() {
    this.logger.log('Running daily reminder check...');
    const count = await this.sendDueReminders();
    this.logger.log(`Daily check complete — ${count} email(s) sent`);
    return count;
  }

  async sendDueReminders(): Promise<number> {
    const due = await this.reminders
      .createQueryBuilder('r')
      .innerJoinAndSelect('r.user', 'u')
      .where('r.is_active = true')
      .andWhere("r.expiry_date - CURRENT_DATE = ANY(r.remind_days_before)")
      .andWhere('u.email_verified = true')
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
    if (!this.resend) {
      this.logger.warn(`Email skipped (no API key): "${title}" → ${to}`);
      return;
    }

    const subject =
      daysLeft === 0
        ? `"${title}" expires today`
        : `"${title}" expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`;

    const { error } = await this.resend.emails.send({
      from: this.config.get<string>('RESEND_FROM') ?? 'Remindly <reminders@remindly.app>',
      to,
      subject,
      html: this.buildEmailHtml(title, daysLeft),
    });

    if (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
    } else {
      this.logger.log(`Email sent to ${to}: "${title}" (${daysLeft}d left)`);
    }
  }

  private buildEmailHtml(title: string, daysLeft: number): string {
    const urgencyColor = daysLeft <= 7 ? '#E05C5C' : daysLeft <= 30 ? '#E8A838' : '#1A1A2E';
    const urgencyText =
      daysLeft === 0
        ? 'expires <strong>today</strong>'
        : daysLeft === 1
          ? 'expires <strong>tomorrow</strong>'
          : `expires in <strong>${daysLeft} days</strong>`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — Remindly</title>
</head>
<body style="margin:0;padding:0;background:#F7F5F0;font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F5F0;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Logo -->
          <tr>
            <td style="padding-bottom:32px;text-align:center;">
              <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#E8A838;margin-right:6px;vertical-align:middle;"></span>
              <span style="font-size:18px;font-weight:600;color:#1A1A2E;vertical-align:middle;">Remindly</span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:16px;border:1px solid rgba(26,26,46,0.08);padding:40px 36px;box-shadow:0 4px 24px rgba(26,26,46,0.06);">

              <!-- Days badge -->
              <div style="margin-bottom:28px;">
                <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:rgba(26,26,46,0.4);">Days remaining</p>
                <p style="margin:0;font-size:52px;font-weight:700;color:${urgencyColor};line-height:1;font-variant-numeric:tabular-nums;">${daysLeft}</p>
              </div>

              <!-- Title -->
              <h1 style="margin:0 0 6px;font-size:20px;font-weight:600;color:#1A1A2E;">${title}</h1>
              <p style="margin:0 0 28px;font-size:14px;color:rgba(26,26,46,0.5);">This item ${urgencyText}.</p>

              <!-- CTA -->
              <a href="${process.env.FRONTEND_URL ?? 'http://localhost:4200'}/dashboard"
                 style="display:inline-block;background:#E8A838;color:#1A1A2E;font-size:14px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:10px;">
                View in Remindly →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;text-align:center;">
              <p style="margin:0;font-size:12px;color:rgba(26,26,46,0.35);">
                You're receiving this because you set a reminder in Remindly.<br/>
                <a href="${process.env.FRONTEND_URL ?? 'http://localhost:4200'}/settings" style="color:rgba(26,26,46,0.35);">Manage notification settings</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  private daysUntil(expiryDate: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    return Math.round((expiry.getTime() - today.getTime()) / 86_400_000);
  }
}
