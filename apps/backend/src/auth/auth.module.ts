import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from '../email/email.module';
import { User } from '../users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { MicrosoftStrategy } from './microsoft.strategy';

const oauthProviders = [];
if (process.env.GOOGLE_CLIENT_ID) oauthProviders.push(GoogleStrategy);
if (process.env.MICROSOFT_CLIENT_ID) oauthProviders.push(MicrosoftStrategy);

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({}),
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, ...oauthProviders],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
