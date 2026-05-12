import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { Reminder } from './entities/reminder.entity';

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);

  constructor(
    @InjectRepository(Reminder) private readonly repo: Repository<Reminder>,
  ) {}

  async create(userId: string, dto: CreateReminderDto) {
    const reminder = this.repo.create({ ...dto, userId });
    const saved = await this.repo.save(reminder);
    this.logger.log(`Reminder created: "${saved.title}" (id: ${saved.id}) for user ${userId}`);
    return saved;
  }

  findAll(userId: string) {
    this.logger.log(`Fetching all reminders for user ${userId}`);
    return this.repo.find({ where: { userId }, order: { expiryDate: 'ASC' } });
  }

  async findOne(userId: string, id: string) {
    const reminder = await this.repo.findOne({ where: { id } });
    this.assertOwnership(reminder, userId, id);
    return reminder;
  }

  async update(userId: string, id: string, dto: UpdateReminderDto) {
    const reminder = await this.repo.findOne({ where: { id } });
    this.assertOwnership(reminder, userId, id);
    Object.assign(reminder, dto);
    const saved = await this.repo.save(reminder);
    this.logger.log(`Reminder updated: "${saved.title}" (id: ${id}) by user ${userId}`);
    return saved;
  }

  async remove(userId: string, id: string) {
    const reminder = await this.repo.findOne({ where: { id } });
    this.assertOwnership(reminder, userId, id);
    await this.repo.remove(reminder);
    this.logger.log(`Reminder deleted: id ${id} by user ${userId}`);
    return { message: 'Reminder deleted' };
  }

  async toggle(userId: string, id: string) {
    const reminder = await this.repo.findOne({ where: { id } });
    this.assertOwnership(reminder, userId, id);
    reminder.isActive = !reminder.isActive;
    const saved = await this.repo.save(reminder);
    this.logger.log(`Reminder toggled: id ${id} → isActive=${saved.isActive} by user ${userId}`);
    return { id: saved.id, isActive: saved.isActive, updatedAt: saved.updatedAt };
  }

  private assertOwnership(reminder: Reminder | null, userId: string, id: string) {
    if (!reminder) {
      this.logger.warn(`Reminder not found: id ${id}`);
      throw new NotFoundException('Reminder not found');
    }
    if (reminder.userId !== userId) {
      this.logger.warn(`Forbidden: user ${userId} attempted to access reminder ${id} owned by ${reminder.userId}`);
      throw new ForbiddenException();
    }
  }
}
