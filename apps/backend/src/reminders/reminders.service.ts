import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reminder } from './entities/reminder.entity';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';

@Injectable()
export class RemindersService {
  constructor(
    @InjectRepository(Reminder) private readonly repo: Repository<Reminder>,
  ) {}

  create(userId: string, dto: CreateReminderDto) {
    const reminder = this.repo.create({ ...dto, userId });
    return this.repo.save(reminder);
  }

  findAll(userId: string) {
    return this.repo.find({ where: { userId }, order: { expiryDate: 'ASC' } });
  }

  async findOne(userId: string, id: string) {
    const reminder = await this.repo.findOne({ where: { id } });
    this.assertOwnership(reminder, userId);
    return reminder;
  }

  async update(userId: string, id: string, dto: UpdateReminderDto) {
    const reminder = await this.repo.findOne({ where: { id } });
    this.assertOwnership(reminder, userId);
    Object.assign(reminder, dto);
    return this.repo.save(reminder);
  }

  async remove(userId: string, id: string) {
    const reminder = await this.repo.findOne({ where: { id } });
    this.assertOwnership(reminder, userId);
    await this.repo.remove(reminder);
    return { message: 'Reminder deleted' };
  }

  async toggle(userId: string, id: string) {
    const reminder = await this.repo.findOne({ where: { id } });
    this.assertOwnership(reminder, userId);
    reminder.isActive = !reminder.isActive;
    const saved = await this.repo.save(reminder);
    return { id: saved.id, isActive: saved.isActive, updatedAt: saved.updatedAt };
  }

  private assertOwnership(reminder: Reminder | null, userId: string) {
    if (!reminder) throw new NotFoundException('Reminder not found');
    if (reminder.userId !== userId) throw new ForbiddenException();
  }
}
