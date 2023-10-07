import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Token } from './token.model';

@Injectable()
export class TokenService {
  constructor(@InjectModel(Token) private tokenRepository: typeof Token) {}

  async create(createUserTokenDto) {
    return await this.tokenRepository.create(createUserTokenDto);
  }

  async delete(userId: number, token: string) {
    await this.tokenRepository.destroy({ where: { userId, token } });
  }

  async exists(userId: number, token: string): Promise<boolean> {
    const res = await this.tokenRepository.findOne({ where: { userId, token } });
    return !!res;
  }
}
