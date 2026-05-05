import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { SettingsService } from './settings.service';

type AuthRequest = Request & { user: User };

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  get(@Req() req: AuthRequest) {
    return this.settingsService.getOrCreate(req.user.id);
  }

  @Patch()
  update(@Req() req: AuthRequest, @Body() dto: UpdateSettingsDto) {
    return this.settingsService.update(req.user.id, dto);
  }
}
