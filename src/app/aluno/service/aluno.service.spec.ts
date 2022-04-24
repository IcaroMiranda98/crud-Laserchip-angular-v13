import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { AlunoService } from './aluno.service'
import { HttpTestingController } from '@angular/common/http/testing'
import { Aluno } from '../model/aluno.model'
import { AlunoSexoEnum } from 'src/app/shared/enum/aluno-sexo'

const API_URL = 'https://api-laser-teste.herokuapp.com/alunos'

describe('AlunoService', () => {
  let service: AlunoService
  let http: HttpTestingController

  const MOCK_ALUNOS = <Aluno[]>[
    {
      id: 1,
      nome: 'Ícaro',
      sobrenome: 'Miranda',
      idade: 24,
      sexo: AlunoSexoEnum.Masculino,
    },
    {
      id: 2,
      nome: 'Joaquim',
      sobrenome: 'Messias',
      idade: 50,
      sexo: AlunoSexoEnum.Masculino,
    },
    {
      id: 3,
      nome: 'Jorge',
      sobrenome: 'Valente',
      idade: 24,
      sexo: AlunoSexoEnum.Masculino,
    },
  ]

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    })
    service = TestBed.inject(AlunoService)
    http = TestBed.inject(HttpTestingController)
    http = TestBed.get(HttpTestingController)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('deve buscar uma lista de alunos do servidor', () => {
    service.obterTodosAlunos().subscribe((response: Aluno[]) => {
      expect(response[0].id).toEqual(1)
      expect(response[0].nome).toEqual('Ícaro')
      expect(response[0].sobrenome).toEqual('Miranda')
      expect(response[0].idade).toEqual(24)
      expect(response[0].sexo).toEqual(AlunoSexoEnum.Masculino)
      expect(response.length).toEqual(3)
    })

    const httpRequest = http.expectOne(API_URL)
    httpRequest.flush(MOCK_ALUNOS)
    expect(httpRequest.request.method).toEqual('GET')
    expect(httpRequest.request.responseType).toEqual('json')
  })

  it('deve inserir um aluno via Api[post]', () => {
    service.insereAluno(MOCK_ALUNOS[0]).subscribe((response: Aluno) => {
      expect(response).toHaveBeenCalled()
    })

    const httpRequest = http.expectOne(API_URL)
    expect(httpRequest.request.method).toEqual('POST')
    expect(httpRequest.request.responseType).toEqual('json')
  })

  it('deve alterar aluno via Api[PUT]', () => {
    service
      .alteraAluno(<Aluno>{
        id: MOCK_ALUNOS[0].id,
        nome: 'Nome alterado',
        sobrenome: 'Sobrenome alterado',
        idade: MOCK_ALUNOS[0].idade,
        sexo: MOCK_ALUNOS[0].sexo,
      })
      .subscribe((response: Aluno) => {
        expect(response).toHaveBeenCalled()
      })

    const httpRequest = http.expectOne(`${API_URL}/${MOCK_ALUNOS[0].id}`)
    expect(httpRequest.request.method).toEqual('PUT')
    expect(httpRequest.request.responseType).toEqual('json')
  })

  it('deve excluir aluno via Api[DELTE]', () => {
    service.excluiAluno(MOCK_ALUNOS[0].id).subscribe((response: any) => {
      expect(response).toHaveBeenCalled()
    })
    const httpRequest = http.expectOne(`${API_URL}/${MOCK_ALUNOS[0].id}`)
    httpRequest.flush(MOCK_ALUNOS)
    expect(httpRequest.request.method).toEqual('DELETE')
    expect(httpRequest.request.responseType).toEqual('json')
  })
})
