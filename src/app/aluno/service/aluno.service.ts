import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Aluno } from '../model/aluno.model';

@Injectable({
  providedIn: 'root',
})
export class AlunoService {
  private _alunoApiUrl : string = 'https://api-laser-teste.herokuapp.com/alunos';
  constructor(private _http: HttpClient) {}

  obterTodosAlunos(): Observable<Aluno[]> {
    return this._http.get<Aluno[]>(this._alunoApiUrl);
  }

  insereAluno(aluno: Aluno): Observable<Aluno> {
    return this._http.post<Aluno>(this._alunoApiUrl, aluno);
  }

  alteraAluno(aluno: Aluno): Observable<Aluno> {
    return this._http.put<Aluno>(`${this._alunoApiUrl}/${aluno.id}`, aluno);
  }

  excluiAluno(id: number): Observable<any> {
    return this._http.delete(`${this._alunoApiUrl}/${id}`);
  }

}