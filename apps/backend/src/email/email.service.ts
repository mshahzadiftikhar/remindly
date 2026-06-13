import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend | null;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    const apiKey = config.get<string>('RESEND_API_KEY');
    if (apiKey) {
      this.resend = new Resend(apiKey);
    } else {
      this.resend = null;
      this.logger.warn('RESEND_API_KEY is not set — email sending is disabled');
    }
    this.from = config.get<string>('RESEND_FROM', 'onboarding@resend.dev');
  }

  async sendVerificationEmail(to: string, verifyUrl: string): Promise<void> {
    if (!this.resend) {
      this.logger.warn(`Email skipped (no API key): verification → ${to}`);
      return;
    }
    const { error } = await this.resend.emails.send({
      from: this.from,
      to,
      subject: 'Verify your Remindly email',
      html: verificationHtml(verifyUrl),
    });

    if (error) {
      this.logger.error(`Failed to send verification email to ${to}: ${error.message}`);
      throw new Error('Failed to send verification email');
    }

    this.logger.log(`Verification email sent to ${to}`);
  }

  async sendPasswordReset(to: string, resetUrl: string): Promise<void> {
    if (!this.resend) {
      this.logger.warn(`Email skipped (no API key): password reset → ${to}`);
      return;
    }
    const { error } = await this.resend.emails.send({
      from: this.from,
      to,
      subject: 'Reset your Remindly password',
      html: passwordResetHtml(resetUrl),
    });

    if (error) {
      this.logger.error(`Failed to send password reset email to ${to}: ${error.message}`);
      throw new Error('Failed to send password reset email');
    }

    this.logger.log(`Password reset email sent to ${to}`);
  }
}

function verificationHtml(verifyUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#f5f3ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ef;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <span style="font-size:20px;font-weight:700;color:#1a1a2e;letter-spacing:-0.3px;">Remindly</span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:16px;padding:40px 40px 36px;border:1px solid #e8e5df;">
              <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1a1a2e;line-height:1.3;">Verify your email</p>
              <p style="margin:0 0 28px;font-size:14px;color:#6b6b7b;line-height:1.6;">
                Thanks for signing up! Click the button below to verify your email address so we can send you reminders.
              </p>

              <!-- CTA button -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:#b5821a;border-radius:10px;">
                    <a href="${verifyUrl}" target="_blank"
                      style="display:inline-block;padding:13px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:-0.1px;">
                      Verify email
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 16px;font-size:13px;color:#9b9baa;line-height:1.5;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin:0 0 28px;font-size:12px;color:#b5821a;word-break:break-all;">${verifyUrl}</p>

              <hr style="border:none;border-top:1px solid #f0ede8;margin:0 0 24px;" />

              <p style="margin:0;font-size:12px;color:#b0adb8;line-height:1.6;">
                If you didn't create a Remindly account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:20px;">
              <p style="margin:0;font-size:12px;color:#b0adb8;">
                &copy; ${new Date().getFullYear()} Remindly &nbsp;·&nbsp; You're receiving this because you created an account.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
}

function passwordResetHtml(resetUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#f5f3ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ef;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <span style="font-size:20px;font-weight:700;color:#1a1a2e;letter-spacing:-0.3px;">Remindly</span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:16px;padding:40px 40px 36px;border:1px solid #e8e5df;">
              <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1a1a2e;line-height:1.3;">Reset your password</p>
              <p style="margin:0 0 28px;font-size:14px;color:#6b6b7b;line-height:1.6;">
                We received a request to reset the password for your Remindly account.
                Click the button below to choose a new one. This link expires in <strong>1 hour</strong>.
              </p>

              <!-- CTA button -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:#b5821a;border-radius:10px;">
                    <a href="${resetUrl}" target="_blank"
                      style="display:inline-block;padding:13px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:-0.1px;">
                      Reset password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 16px;font-size:13px;color:#9b9baa;line-height:1.5;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin:0 0 28px;font-size:12px;color:#b5821a;word-break:break-all;">${resetUrl}</p>

              <hr style="border:none;border-top:1px solid #f0ede8;margin:0 0 24px;" />

              <p style="margin:0;font-size:12px;color:#b0adb8;line-height:1.6;">
                If you didn't request a password reset, you can safely ignore this email —
                your password will not change.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:20px;">
              <p style="margin:0;font-size:12px;color:#b0adb8;">
                &copy; ${new Date().getFullYear()} Remindly &nbsp;·&nbsp; You're receiving this because you requested a password reset.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
}
