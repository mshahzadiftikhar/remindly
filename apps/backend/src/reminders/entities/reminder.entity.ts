import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ReminderCategory {
  DOCUMENT = 'document',
  SUBSCRIPTION = 'subscription',
  WARRANTY = 'warranty',
  INSURANCE = 'insurance',
  CUSTOM = 'custom',
}

@Entity('reminders')
export class Reminder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.reminders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'enum', enum: ReminderCategory })
  category: ReminderCategory;

  @Column({ name: 'expiry_date', type: 'date' })
  expiryDate: string;

  @Column({
    name: 'remind_days_before',
    type: 'int',
    array: true,
    default: () => "'{30,7,1}'",
  })
  remindDaysBefore: number[];

  @Column({ nullable: true, type: 'text' })
  notes: string | null;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
