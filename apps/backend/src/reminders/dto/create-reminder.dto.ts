import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ReminderCategory } from '../entities/reminder.entity';

export class CreateReminderDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsEnum(ReminderCategory)
  category: ReminderCategory;

  @IsDateString()
  expiryDate: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Min(1, { each: true })
  remindDaysBefore: number[];

  @IsString()
  @IsOptional()
  notes?: string;
}
