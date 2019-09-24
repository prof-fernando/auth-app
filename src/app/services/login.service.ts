import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private af: AngularFireAuth) {}

  public criarNovoUsuario(u: Usuario) {
    this.af.auth.createUserWithEmailAndPassword(u.email, u.senha).then(
      credencias => {
        console.log('Cadastro realizado');
        credencias.user.updateProfile({
          displayName: u.nome
        });
      },
      erro => {
        if (erro.code === 'auth/invalid-email') {
          console.log('Email inválido');
        }
        console.log(erro);
      }
    );
  }
}
