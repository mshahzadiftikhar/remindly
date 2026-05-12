import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { UserSettings } from './entities/user-settings.entity';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(
    @InjectRepository(UserSettings) private readonly repo: Repository<UserSettings>,
  ) {}

  async getOrCreate(userId: string) {
    const existing = await this.repo.findOne({ where: { userId } });
    if (existing) return existing;
    this.logger.log(`Creating default settings for user ${userId}`);
    const settings = this.repo.create({ userId });
    return this.repo.save(settings);
  }

  async update(userId: string, dto: UpdateSettingsDto) {
    const settings = await this.getOrCreate(userId);
    Object.assign(settings, dto);
    const saved = await this.repo.save(settings);
    this.logger.log(`Settings updated for user ${userId}`);
    return saved;
  }
}
