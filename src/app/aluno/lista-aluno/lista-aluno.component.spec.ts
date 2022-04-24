import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, flush, TestBed } from '@angular/core/testing';
import {
  MatDialog,
  MatDialogRef,
  _MatDialogContainerBase,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlunoSexoEnum } from 'src/app/shared/enum/aluno-sexo';
import { Aluno } from '../model/aluno.model';
import { AlunoService } from '../service/aluno.service';
import { ListaAlunoComponent } from './lista-aluno.component';

function carregaListaDeAlunos(http: HttpTestingController, API_URL: string) {
  let httpRequest = http.expectOne(API_URL);
  httpRequest.flush(MOCK_ALUNOS);
  return httpRequest;
}

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
];

describe('ListaAlunoComponent', () => {
  let component: ListaAlunoComponent;
  let fixture: ComponentFixture<ListaAlunoComponent>;
  let service: AlunoService;
  let http: HttpTestingController;
  const API_URL = 'https://api-laser-teste.herokuapp.com/alunos';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListaAlunoComponent],
      providers: [
        { provide: MatDialog, useValue: MatDialog },
        { provide: MatSnackBar, useValue: {} },
        { provide: MatDialogRef, useValue: MatDialogRef },
        { provide: MatSnackBar, useValue: MatSnackBar },
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AlunoService);
    http = TestBed.inject(HttpTestingController);
    http = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(ListaAlunoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o component e carregar seus injects', () => {
    expect(component).toBeTruthy();
    let httpRequest = carregaListaDeAlunos(http, API_URL);
    expect(httpRequest.request.method).toEqual('GET');
    expect(httpRequest.request.responseType).toEqual('json');
  });

  it('deve filtrar os dados da lista de Alunos (dataSouce-MatTableDataSource)', () => {
    let httpRequest = carregaListaDeAlunos(http, API_URL);
    component.dataSource.data = MOCK_ALUNOS;
    expect(component.dataSource._filterData.length).toEqual(1);
  });

  it('deve validar e tratar o retorno do formulario', () => {
    expect(component.processaRegistro(new Aluno())).toBeTrue();
    expect(component.processaRegistro(MOCK_ALUNOS[1])).toBeTrue();
    expect(component.processaRegistro(null as unknown as Aluno)).toBeFalse();
  });

  it('deve validar se o retorno do formulario trata-se de um novo aluno', () => {
    expect(component.validaNovoRegistro(new Aluno())).toBeTrue();
    expect(component.validaNovoRegistro(MOCK_ALUNOS[1])).toBeFalse();
  });

  it('deve alterar o registro do aluno', () => {
    let aluno = <Aluno>{
      id: MOCK_ALUNOS[0].id,
      nome: 'Nome Modificado no processo de alteração',
      sobrenome: MOCK_ALUNOS[0].sobrenome,
      idade: MOCK_ALUNOS[0].idade,
      sexo: MOCK_ALUNOS[0].sexo,
    };

    let httpRequest = carregaListaDeAlunos(http, API_URL);

    component.atualizaRegistroAluno(aluno);
    httpRequest = http.expectOne(`${API_URL}/${MOCK_ALUNOS[0].id}`);
    httpRequest.flush(aluno);
    expect(httpRequest.request.method).toEqual('PUT');
    expect(httpRequest.request.responseType).toEqual('json');
    expect(component.dataSource.data[0]).toEqual(aluno);
  });
});

describe('ListaAlunoComponent-excluiRegistroAluno-insereRegistroAluno', () => {
  let component: ListaAlunoComponent;
  let fixture: ComponentFixture<ListaAlunoComponent>;
  let service: AlunoService;
  let http: HttpTestingController;
  const API_URL = 'https://api-laser-teste.herokuapp.com/alunos';

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaAlunoComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: MatDialog, useValue: MatDialog },
        { provide: MatSnackBar, useValue: {} },
        { provide: MatDialogRef, useValue: MatDialogRef },
      ],
    }).compileComponents();
    service = TestBed.inject(AlunoService);
    http = TestBed.inject(HttpTestingController);
    http = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(ListaAlunoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  /*it('deve excluir registro da lista de alunos', () => {
    let httpRequest = carregaListaDeAlunos(http, API_URL);
    expect(component.dataSource.data.length).toEqual(3);

    component.excluiRegistroAluno(MOCK_ALUNOS[0]);
    httpRequest = http.expectOne(`${API_URL}/${MOCK_ALUNOS[0].id}`);
    httpRequest.flush(MOCK_ALUNOS[0]);

    expect(httpRequest.request.method).toEqual('DELETE');
    expect(httpRequest.request.responseType).toEqual('json');
    expect(component.dataSource.data.length).toEqual(2);
  });*/
  it('deve inserir um novo registro aluno', () => {
    let aluno = <Aluno>{
      id: 0,
      nome: 'Novo',
      sobrenome: 'Registro Teste Da Silva',
      idade: 2055,
      sexo: AlunoSexoEnum.Masculino,
    };

    let httpRequest = carregaListaDeAlunos(http, API_URL);

    component.insereRegistroAluno(aluno);
    httpRequest = http.expectOne(`${API_URL}`);
    httpRequest.flush(aluno);
    expect(httpRequest.request.method).toEqual('POST');
    expect(httpRequest.request.responseType).toEqual('json');
    aluno.id = 4;
    expect(
      component.dataSource.data[component.dataSource.data.length - 1]
    ).toEqual(aluno);
  });
});
