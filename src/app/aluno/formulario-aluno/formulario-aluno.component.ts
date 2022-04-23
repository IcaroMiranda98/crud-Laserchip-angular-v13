import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Aluno } from '../model/aluno.model';

@Component({
  selector: 'app-formulario-aluno',
  templateUrl: './formulario-aluno.component.html',
  styleUrls: ['./formulario-aluno.component.less'],
})
export class FormularioAlunoComponent implements OnInit {
  @ViewChild('adicionar')
  botaoAdicionar!: MatButton;

  alteracao = false;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: Aluno,
    public dialogRef: MatDialogRef<FormularioAlunoComponent>
  ) {}

  ngOnInit(): void {
    if (this.data.id) {
      this.alteracao = true;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  setFocusBotaoAdicionar() {
    this.botaoAdicionar.focus();
  }
}
