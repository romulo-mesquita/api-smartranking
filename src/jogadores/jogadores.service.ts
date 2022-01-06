import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JogadoresService {
  private readonly logger = new Logger(JogadoresService.name);
  private jogadores: Jogador[] = [];
  async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
    const { email } = criarJogadorDto;
    const jogadorExite = await this.jogadores.find(
      (jogador) => jogador.email === email,
    );
    if (jogadorExite) {
      this.atualizar(jogadorExite, criarJogadorDto);
    } else {
      this.criar(criarJogadorDto);
    }
  }

  private atualizar(
    jogadorExite: Jogador,
    criarJogadorDto: CriarJogadorDto,
  ): void {
    const { nome } = criarJogadorDto;
    jogadorExite.nome = nome;
  }

  private criar(criaJogadorDto: CriarJogadorDto): void {
    const { nome, telefone, email } = criaJogadorDto;

    const jogador: Jogador = {
      _id: uuidv4(),
      nome,
      telefone,
      email,
      ranking: 'A',
      posicaoRanking: 1,
      urlFotoJogador: 'www.google.com',
    };
    this.logger.log(JSON.stringify(jogador));
    this.jogadores.push(jogador);
  }

  async consultarJogadores(): Promise<Jogador[]> {
    return await this.jogadores;
  }

  async consultarJogador(email: string): Promise<Jogador> {
    const jogadorExite = this.jogadores.find(
      (jogador) => jogador.email === email,
    );

    if (!jogadorExite) {
      throw new NotFoundException(`Email: ${email} não encontrado no banco `);
    }
    return jogadorExite;
  }

  async excluirJogador(email: string): Promise<string> {
    const jogadorExite = this.jogadores.find(
      (jogador) => jogador.email === email,
    );
    if (!jogadorExite) {
      throw new NotFoundException(`Email: ${email} não encontrado no banco `);
    }
    this.jogadores = this.jogadores.filter(
      (jogador) => jogador.email != jogadorExite.email,
    );
    return 'Jogador excluido com sucesso!';
  }
}
