import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {
  private readonly logger = new Logger(JogadoresService.name);
  private jogadores: Jogador[] = [];
  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  private async getJogador(email): Promise<Jogador> {
    return await this.jogadorModel.findOne({ email }).exec();
  }

  async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
    const { email } = criarJogadorDto;
    const jogadorExite = await this.getJogador(email);
    if (jogadorExite) {
      this.atualizar(criarJogadorDto);
    } else {
      this.criar(criarJogadorDto);
    }
  }

  private async atualizar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    return await this.jogadorModel
      .findOneAndUpdate(
        {
          email: criarJogadorDto.email,
        },
        { $set: criarJogadorDto },
      )
      .exec();
  }

  private async criar(criaJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const newJogador = new this.jogadorModel(criaJogadorDto);

    return await newJogador.save();
  }

  async consultarJogadores(): Promise<Jogador[]> {
    return await this.jogadorModel.find().exec();
  }

  async consultarJogador(email: string): Promise<Jogador> {
    const jogadorExite = await this.getJogador(email);
    if (!jogadorExite) {
      throw new NotFoundException(`Email: ${email} não encontrado no banco `);
    }
    return jogadorExite;
  }

  async excluirJogador(email: string): Promise<string> {
    const jogadorExite = await this.getJogador(email);
    if (!jogadorExite) {
      throw new NotFoundException(`Email: ${email} não encontrado no banco `);
    }
    await this.jogadorModel.remove({ email }).exec();
    return 'Jogador excluido com sucesso!';
  }
}
