import { AlunoSexo } from '../../shared/enum/aluno-sexo';

export class Aluno {
  id: number;
  nome: string;
  sobrenome: string;
  idade: number;
  sexo: AlunoSexo;

  constructor() {
    this.id = 0;
    this.nome = '';
    this.sobrenome = '';
    this.idade = 0;
    this.sexo = AlunoSexo.Outro;
  }
}
