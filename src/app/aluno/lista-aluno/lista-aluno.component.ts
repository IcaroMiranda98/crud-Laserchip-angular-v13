import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { FormularioAlunoComponent } from '../formulario-aluno/formulario-aluno.component';
import { Aluno } from '../model/aluno.model';
import { AlunoSexo } from '../../shared/enum/aluno-sexo';
import { AlunoService } from '../service/aluno.service';

@Component({
  selector: 'app-lista-aluno',
  templateUrl: './lista-aluno.component.html',
  styleUrls: ['./lista-aluno.component.less'],
  providers: [AlunoService],
})
export class ListaAlunoComponent {
  dataSource = new MatTableDataSource(new Array<Aluno>());
  enumAlunoSexo = AlunoSexo;

  constructor(
    public dialog: MatDialog,
    private _serviceAluno: AlunoService,
    private _snackBar: MatSnackBar
  ) {
    _serviceAluno.obterTodosAlunos().subscribe((result: Aluno[]) => {
      this.dataSource = new MatTableDataSource(
        this._trataDadosGetAlunosApi(result)
      );
    });
  }
  private _trataDadosGetAlunosApi(result: Aluno[]) {
    const tratamentoResult: Aluno[] = [];
    result.map((x) => {
      if (x.id != undefined) tratamentoResult.push(x);
    });
    return tratamentoResult;
  }

  filtraListaAlunos(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  abreFormularioAluno(aluno: any) {
    const dialogRef = this.dialog.open(FormularioAlunoComponent, {
      width: '50vw',
      data:
        aluno?.id != null
          ? {
              id: aluno.id,
              nome: aluno.nome,
              sobrenome: aluno.sobrenome,
              idade: aluno.idade,
              sexo: aluno.sexo,
            }
          : new Aluno(),
    });
    this._subscribeFechamendoDoFomularioAluno(dialogRef);
  }

  private _subscribeFechamendoDoFomularioAluno(dialogRef: any) {
    dialogRef.afterClosed().subscribe((result: Aluno) => {
      if (result != undefined) {
        if (this._validaRegistroNovo(result)) {
          this._insereCadastroAluno(result);
        } else {
          this._atualizaCadastroAluno(result);
        }
      }
    });
  }

  private _atualizaCadastroAluno(aluno: Aluno) {
    this._serviceAluno.alteraAluno(aluno).subscribe((alunoResponse: Aluno) => {
      console.log(alunoResponse);
      const index = this.dataSource.data.findIndex((x) => x.id == aluno.id);
      this.dataSource.data.splice(index, 1, aluno);
      this.dataSource._updateChangeSubscription();
      this.snackBarMensageSucesses('Registro alterado com sucesso!');
    });
  }

  private _insereCadastroAluno(aluno: Aluno) {
    this._serviceAluno.insereAluno(aluno).subscribe((alunoResponse: Aluno) => {
      aluno.id = alunoResponse.id;
      this.dataSource.data.push(aluno);
      this.dataSource._updateChangeSubscription();
      this.snackBarMensageSucesses('Aluno inserido com sucesso!');
    });
  }

  excluiAluno(aluno: any) {
    this._serviceAluno.excluiAluno(aluno.id).subscribe((result: any) => {
      this.snackBarMensageSucesses('Aluno excluido com sucesso!');
      this.dataSource.data = this.dataSource.data.filter(
        (x) => x.id != aluno.id
      );
    });
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

  private _validaRegistroNovo(aluno: Aluno): boolean {
    if (aluno.id == null) return false;

    if (aluno.id == undefined) return false;

    if (aluno.id > 0) return false;

    return true;

    debugger;
    console.log('Teste');
    for (let i = 0; i < 12; i++) {
      console.log(i);
    }
  }
}
