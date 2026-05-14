import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';
import { AuthService } from './auth.service';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(config: ConfigService, private readonly authService: AuthService) {
    super({
      clientID: config.get<string>('MICROSOFT_CLIENT_ID', ''),
      clientSecret: config.get<string>('MICROSOFT_CLIENT_SECRET', ''),
      callbackURL: `${config.get('API_URL', 'http://localhost:3000/api')}/auth/microsoft/callback`,
      scope: ['user.read'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: { id: string; displayName: string; emails?: { value: string }[]; _json?: { mail?: string; userPrincipalName?: string } },
    done: (err: unknown, user?: unknown) => void,
  ) {
    const email =
      profile.emails?.[0]?.value ??
      profile._json?.mail ??
      profile._json?.userPrincipalName ??
      '';
    const user = await this.authService.validateOAuthUser({
      provider: 'microsoft',
      providerId: profile.id,
      email,
      fullName: profile.displayName ?? null,
    });
    done(null, user);
  }
}
