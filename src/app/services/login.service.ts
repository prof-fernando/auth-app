import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Usuario } from '../models/Usuario';
import { AlertService } from './alert.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private af: AngularFireAuth, private al: AlertService, private route: Router) {}

  get usuarioLogado(): firebase.User {
    return this.af.auth.currentUser;
  }

  public async login(email: string, senha: string) {
    const loading = await this.al.loading();
    this.af.auth.signInWithEmailAndPassword(email, senha).then(
      user => {
        loading.dismiss();
        if (user.user.emailVerified) {
          this.route.navigate(['administracao']);
        } else {
          this.al.toast({ message: 'Acesso negado verifique seu email ' });
          this.logout();
        }
      },
      error => {
        loading.dismiss();
        this.al.toast({ message: 'Usuário ou senha inválidos' });
      }
    );
  }

  public logout() {
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
            // envia um email de confirmacao
            this.af.auth.currentUser.sendEmailVerification({
              url: 'http://localhost:8100'
            });
            loading.dismiss();
            this.al.alert('Cadastro efetivado com sucesso! Verifique seu email', {
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

  public isLogado(): Observable<boolean> {
    return this.af.authState.pipe(
      map(usuario => {
        // se usuario diferente de nulo
        // existe sessão ativa, ou usuario logado
        return usuario !== null;
      })
    );
  }
}
