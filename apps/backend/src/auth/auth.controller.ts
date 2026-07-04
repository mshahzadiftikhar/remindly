import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

const isProduction = process.env.NODE_ENV === 'production';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
  secure: isProduction,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:4200';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const profile = await this.authService.register(dto);
    const token = this.authService.signToken({ id: profile.id, email: profile.email } as User);
    res.cookie('access_token', token, COOKIE_OPTIONS);
    return profile;
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const profile = await this.authService.login(dto);
    const token = this.authService.signToken({ id: profile.id, email: profile.email } as User);
    res.cookie('access_token', token, COOKIE_OPTIONS);
    return profile;
  }

  @Post('forgot-password')
  @HttpCode(200)
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @HttpCode(200)
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Logged out' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: Request & { user: User }) {
    const user = req.user;
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    };
  }

  @Get('verify-email')
  @HttpCode(200)
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('resend-verification')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  resendVerification(@Req() req: Request & { user: User }) {
    return this.authService.resendVerification(req.user.id);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleCallback(@Req() req: Request & { user: User }, @Res() res: Response) {
    const token = this.authService.signToken(req.user);
    res.cookie('access_token', token, COOKIE_OPTIONS);
    res.redirect(`${FRONTEND_URL}/#/dashboard`);
  }

  @Get('microsoft')
  @UseGuards(AuthGuard('microsoft'))
  microsoftLogin() {}

  @Get('microsoft/callback')
  @UseGuards(AuthGuard('microsoft'))
  microsoftCallback(@Req() req: Request & { user: User }, @Res() res: Response) {
    const token = this.authService.signToken(req.user);
    res.cookie('access_token', token, COOKIE_OPTIONS);
    res.redirect(`${FRONTEND_URL}/#/dashboard`);
  }
}
