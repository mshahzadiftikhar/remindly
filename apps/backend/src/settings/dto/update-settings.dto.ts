import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateSettingsDto {
  @IsEmail()
  @IsOptional()
  notificationEmail?: string;

  @IsString()
  @IsOptional()
  timezone?: string;
}
