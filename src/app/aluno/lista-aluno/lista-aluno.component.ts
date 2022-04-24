import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { FormularioAlunoComponent } from '../formulario-aluno/formulario-aluno.component';
import { Aluno } from '../model/aluno.model';
import { AlunoSexoEnum } from '../../shared/enum/aluno-sexo';
import { AlunoService } from '../service/aluno.service';

@Component({
  selector: 'app-lista-aluno',
  templateUrl: './lista-aluno.component.html',
  styleUrls: ['./lista-aluno.component.less'],
  providers: [AlunoService],
})
export class ListaAlunoComponent implements OnInit {
  dataSource = new MatTableDataSource(new Array<Aluno>());
  enumAlunoSexo = AlunoSexoEnum;
  filtro = '';

  constructor(
    public dialog: MatDialog,
    private _serviceAluno: AlunoService,
    private _snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this._serviceAluno.obterTodosAlunos().subscribe((result: Aluno[]) => {
      this.dataSource = new MatTableDataSource(result);
    });
  }

  filtraListaAlunos(filtro: string) {
    const filterValue = filtro;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  abreFormularioAluno(aluno: any) {
    const dialogRef = this.dialog.open(FormularioAlunoComponent, {
      width: '50vw',
      data:
        aluno?.id != null
          ? <Aluno>{
              id: aluno.id,
              nome: aluno.nome,
              sobrenome: aluno.sobrenome,
              idade: aluno.idade,
              sexo: aluno.sexo,
            }
          : new Aluno(),
    });
    dialogRef
      .afterClosed()
      .subscribe((result: Aluno) => this.processaRegistro(result));
  }

  processaRegistro(registro: Aluno): boolean {
    if (registro != undefined) {
      if (this.validaNovoRegistro(registro)) {
        this.insereRegistroAluno(registro);
      } else {
        this.atualizaRegistroAluno(registro);
      }
      return true;
    }
    return false;
  }

  atualizaRegistroAluno(aluno: Aluno) {
    this._serviceAluno.alteraAluno(aluno).subscribe(
      (alunoResponse: Aluno) => {
        const index = this.dataSource.data.findIndex((x) => x.id == aluno.id);
        this.dataSource.data.splice(index, 1, aluno);
        this.dataSource._updateChangeSubscription();
        this.snackBarMensageSucesses('Registro alterado com sucesso!');
      },
      (erro) => erro
    );
  }

  erro = (error: any) => {
    console.log(error);
  };

  insereRegistroAluno(aluno: Aluno) {
    this._serviceAluno.insereAluno(aluno).subscribe(
      (alunoResponse: Aluno) => {
        aluno.id = alunoResponse.id;
        this.dataSource.data.push(aluno);
        this.dataSource._updateChangeSubscription();
        this.snackBarMensageSucesses('Aluno inserido com sucesso!');
      },
      (erro) => erro
    );
  }

  excluiRegistroAluno(aluno: any) {
    this._serviceAluno.excluiAluno(aluno.id).subscribe(
      (result: any) => {
        this.removerAlunoDaTable(aluno);
        this.snackBarMensageSucesses('Aluno excluido com sucesso!');
      },
      (erro) => erro
    );
  }

  removerAlunoDaTable(aluno: Aluno) {
    const index = this.dataSource.data.findIndex((x) => x.id == aluno.id);
    this.dataSource.data.splice(index, 1);
    this.dataSource._updateChangeSubscription();
  }

  snackBarMensageSucesses(mensagem: string) {
    this._snackBar.open(mensagem, 'Fechar', {
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      duration: 2000,
    });
  }

  displayedColumns: string[] = [
    'id',
    'nome',
    'sobrenome',
    'idade',
    'sexo',
    'action',
  ];

  public validaNovoRegistro(aluno: Aluno): boolean {
    if (aluno.id > 0) return false;
    return true;

    debugger;
    console.log('Teste');
    for (let i = 0; i < 12; i++) {
      console.log(i);
    }
  }
}
