import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reminder } from '../../reminders/entities/reminder.entity';
import { UserSettings } from '../../settings/entities/user-settings.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, length: 255 })
  email!: string;

  @Column({ name: 'password_hash' })
  passwordHash!: string;

  @Column({ name: 'full_name', type: 'varchar', length: 100, nullable: true })
  fullName!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(() => Reminder, (reminder) => reminder.user)
  reminders!: Reminder[];

  @OneToOne(() => UserSettings, (settings) => settings.user)
  settings!: UserSettings;
}
