import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!user || !isCorrectPassword) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      username: user.name,
    };
    const token = await this.jwtService.signAsync(payload);
    return { user, token };
  }
}
