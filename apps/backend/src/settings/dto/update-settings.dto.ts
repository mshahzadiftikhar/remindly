import { IsEmail, IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpdateSettingsDto {
  @ValidateIf((o: UpdateSettingsDto) => o.notificationEmail !== null)
  @IsEmail()
  @IsOptional()
  notificationEmail?: string | null;

  @IsString()
  @IsOptional()
  timezone?: string;
}
