import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from './users/schemas/user.schema';
import { Response } from 'express';


// *** Interface
export interface TokenPayload {
  userId: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) { }

  async login(
    user: User,
    response: Response
  ) {
    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString(),
    }

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get("JWT_EXPIRATION") // ? aku yout ny tk second + expire second
    )

    const token = this.jwtService.sign(tokenPayload);

    response.cookie(
      'Authentication', // *** just name
      token, // *** token
      { // *** options
        httpOnly: true,
        expires,
      }
    )
  }

  logout(response: Response) {
    response.cookie(
      'Authentication',
      '',
      {
        httpOnly: true,
        expires: new Date()
      }
    )
  }
}
