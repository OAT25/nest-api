import { PassportStrategy } from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
export class AccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    });
  }
  async payload(payload: any) {
    return { ...payload.user };
  }
}
