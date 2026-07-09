import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { EmailService } from '../email/email.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly email: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.users.findOne({ where: { email: dto.email } });
    if (exists) {
      this.logger.warn(`Registration failed — email already in use: ${dto.email}`);
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = this.users.create({
      email: dto.email,
      passwordHash,
      fullName: dto.fullName ?? null,
    });
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = verificationToken;
    await this.users.save(user);
    this.logger.log(`User registered: ${user.email} (id: ${user.id})`);

    const frontendUrl = this.config.get('FRONTEND_URL', 'http://localhost:4200');
    const verifyUrl = `${frontendUrl}/#/auth/verify-email?token=${verificationToken}`;
    try {
      await this.email.sendVerificationEmail(user.email, verifyUrl);
    } catch (err) {
      this.logger.warn(
        `Verification email failed to send for ${user.email}, account created anyway: ${(err as Error).message}`,
      );
    }

    return this.toProfile(user);
  }

  async login(dto: LoginDto) {
    const user = await this.users.findOne({ where: { email: dto.email } });
    if (!user) {
      this.logger.warn(`Login failed — no account for: ${dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.passwordHash) {
      this.logger.warn(`Login failed — password login not available for OAuth account: ${dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      this.logger.warn(`Login failed — wrong password for: ${dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`User logged in: ${user.email} (id: ${user.id})`);
    return this.toProfile(user);
  }

  async validateOAuthUser(opts: {
    provider: 'google' | 'microsoft';
    providerId: string;
    email: string;
    fullName: string | null;
  }): Promise<User> {
    const idField = opts.provider === 'google' ? 'googleId' : 'microsoftId';
    let user = await this.users.findOne({ where: { [idField]: opts.providerId } });

    if (!user) {
      user = await this.users.findOne({ where: { email: opts.email } });
      if (user) {
        user[idField] = opts.providerId;
        await this.users.save(user);
        this.logger.log(`Linked ${opts.provider} to existing account: ${opts.email}`);
      } else {
        user = this.users.create({
          email: opts.email,
          fullName: opts.fullName,
          passwordHash: null,
          [idField]: opts.providerId,
        });
        await this.users.save(user);
        this.logger.log(`Created account via ${opts.provider}: ${opts.email}`);
      }
    }

    return user;
  }

  async verifyEmail(token: string) {
    const user = await this.users.findOne({ where: { emailVerificationToken: token } });
    if (!user) {
      throw new BadRequestException('Invalid or expired verification link');
    }
    user.emailVerified = true;
    user.emailVerificationToken = null;
    await this.users.save(user);
    this.logger.log(`Email verified for: ${user.email}`);
    return { message: 'Email verified successfully' };
  }

  async resendVerification(userId: string) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user || user.emailVerified) return;

    const token = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = token;
    await this.users.save(user);

    const frontendUrl = this.config.get('FRONTEND_URL', 'http://localhost:4200');
    const verifyUrl = `${frontendUrl}/#/auth/verify-email?token=${token}`;
    try {
      await this.email.sendVerificationEmail(user.email, verifyUrl);
      this.logger.log(`Verification email resent to: ${user.email}`);
    } catch (err) {
      this.logger.warn(`Failed to resend verification email to ${user.email}: ${(err as Error).message}`);
    }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.users.findOne({ where: { email: dto.email } });
    if (user && user.passwordHash) {
      const token = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = token;
      user.resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await this.users.save(user);
      const frontendUrl = this.config.get('FRONTEND_URL', 'http://localhost:4200');
      const resetUrl = `${frontendUrl}/#/auth/reset-password?token=${token}`;
      try {
        await this.email.sendPasswordReset(user.email, resetUrl);
      } catch (err) {
        this.logger.warn(`Failed to send password reset email to ${user.email}: ${(err as Error).message}`);
      }
    }
    return { message: 'If an account with that email exists, a reset link has been sent.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.users.findOne({ where: { resetPasswordToken: dto.token } });
    if (!user || !user.resetPasswordExpiresAt || user.resetPasswordExpiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }
    user.passwordHash = await bcrypt.hash(dto.password, 12);
    user.resetPasswordToken = null;
    user.resetPasswordExpiresAt = null;
    await this.users.save(user);
    this.logger.log(`Password reset successful for: ${user.email}`);
    return { message: 'Password updated successfully' };
  }

  signToken(user: User) {
    return this.jwt.sign(
      { sub: user.id, email: user.email },
      {
        secret: this.config.get<string>('JWT_SECRET', 'change-me'),
        expiresIn: this.config.get('JWT_EXPIRES_IN', '7d') as unknown as number,
      },
    );
  }

  private toProfile(user: User) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    };
  }
}
