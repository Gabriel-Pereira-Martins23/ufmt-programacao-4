import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(nome: string, senhaPassada: string) {
    const user = await this.usersService.findByNome(nome);
    
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const senhaBate = await bcrypt.compare(senhaPassada, user.senha);
    if (!senhaBate) {
      throw new UnauthorizedException('Senha incorreta');
    }

    const payload = { username: user.nome, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
