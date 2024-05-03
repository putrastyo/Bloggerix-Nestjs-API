import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserOnJwt } from '../types/user-jwt.type';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.RT_SECRET || 'Shhh--bloggerix218751872pp',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: UserOnJwt) {
    const refreshToken = req.headers['authorization'].split(' ')[1];

    return { ...payload, refreshToken };
  }
}
