import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { AlunoSexoEnum } from 'src/app/shared/enum/aluno-sexo'
import { Aluno } from '../model/aluno.model'

import { FormularioAlunoComponent } from './formulario-aluno.component'

describe('FormularioAlunoComponent', () => {
  const mockAluno = <Aluno>{
    id: 1,
    nome: 'Ícaro',
    sobrenome: 'Miranda',
    idade: 24,
    sexo: AlunoSexoEnum.Masculino,
  }

  let component: FormularioAlunoComponent
  let fixture: ComponentFixture<FormularioAlunoComponent>
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormularioAlunoComponent],
      imports: [MatButtonModule, MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockAluno },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioAlunoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
