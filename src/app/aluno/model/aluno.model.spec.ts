import { Aluno } from '../model/aluno.model'
import { AlunoSexoEnum } from '../../shared/enum/aluno-sexo'

describe('Aluno: constructor', () => {
  let alunoModel: Aluno
  const alunoMock = new Aluno()
  alunoMock.id = 0
  alunoMock.nome = ''
  alunoMock.sobrenome = ''
  alunoMock.idade = 0
  alunoMock.sexo = AlunoSexoEnum.Outro

  beforeEach(() => {
    alunoModel = new Aluno()
  })

  it('deve ser criado inicializando as propriedades', () => {
    expect(alunoModel).toEqual(alunoMock)
  })
})
