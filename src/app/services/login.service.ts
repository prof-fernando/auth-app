import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Usuario } from '../models/Usuario';
import { AlertService } from './alert.service';
import { Router } from '@angular/router';
import { FirebaseApp } from '@angular/fire';
import { first } from 'rxjs/operators';
import { IfStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private usuarioLogado: firebase.User;

  constructor(private af: AngularFireAuth, private al: AlertService, private route: Router) {
    this.af.authState.subscribe(user => {
      this.usuarioLogado = user;
    });
  }

  public async login(email: string, senha: string) {
    const loading = await this.al.loading();
    this.af.auth.signInWithEmailAndPassword(email, senha).then(
      user => {
        this.usuarioLogado = user.user;
        loading.dismiss();
        this.route.navigate(['administracao']);
      },
      error => {
        loading.dismiss();
        this.al.toast({ message: 'Usuário ou senha inválidos' });
      }
    );
  }

  public logout() {
    this.usuarioLogado = null;
    this.af.auth.signOut();
    this.route.navigate(['login']);
  }

  public async criarNovoUsuario(u: Usuario) {
    const loading = await this.al.loading();
    this.af.auth.createUserWithEmailAndPassword(u.email, u.senha).then(
      credencias => {
        credencias.user
          .updateProfile({
            displayName: u.nome
          })
          .then(() => {
            loading.dismiss();
            this.al.alert('Cadastro efetivado com sucesso!', {
              buttons: [
                {
                  text: 'continuar',
                  handler: () => {
                    this.route.navigate(['login']);
                  }
                }
              ]
            });
          });
      },
      erro => {
        loading.dismiss();
        if (erro.code === 'auth/invalid-email') {
          this.al.alert('Email inválido');
        }
        console.log(erro);
      }
    );
  }

  public async isLogado(): boolean {
    this.usuarioLogado = await this.af.authState.pipe(first()).toPromise();
    // currentUser armazena o usuário logado na aplicacao

    if (this.usuarioLogado) {
      return true;
    } else {
      return false;
    }
  }
}
