import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSettings } from './entities/user-settings.entity';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(UserSettings) private readonly repo: Repository<UserSettings>,
  ) {}

  async getOrCreate(userId: string) {
    const existing = await this.repo.findOne({ where: { userId } });
    if (existing) return existing;
    const settings = this.repo.create({ userId });
    return this.repo.save(settings);
  }

  async update(userId: string, dto: UpdateSettingsDto) {
    const settings = await this.getOrCreate(userId);
    Object.assign(settings, dto);
    return this.repo.save(settings);
  }
}
