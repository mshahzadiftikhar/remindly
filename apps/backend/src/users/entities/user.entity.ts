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

  @Column({ name: 'password_hash', type: 'varchar', nullable: true })
  passwordHash!: string | null;

  @Column({ name: 'google_id', type: 'varchar', nullable: true, unique: true })
  googleId!: string | null;

  @Column({ name: 'microsoft_id', type: 'varchar', nullable: true, unique: true })
  microsoftId!: string | null;

  @Column({ name: 'full_name', type: 'varchar', length: 100, nullable: true })
  fullName!: string | null;

  @Column({ name: 'reset_password_token', type: 'varchar', nullable: true })
  resetPasswordToken!: string | null;

  @Column({ name: 'reset_password_expires_at', type: 'timestamptz', nullable: true })
  resetPasswordExpiresAt!: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(() => Reminder, (reminder) => reminder.user)
  reminders!: Reminder[];

  @OneToOne(() => UserSettings, (settings) => settings.user)
  settings!: UserSettings;
}
