import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
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
    await this.users.save(user);
    this.logger.log(`User registered: ${user.email} (id: ${user.id})`);
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
      createdAt: user.createdAt,
    };
  }
}
