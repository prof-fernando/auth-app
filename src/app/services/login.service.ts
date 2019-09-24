import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private af: AngularFireAuth) {}

  public criarNovoUsuario(u: Usuario) {
    this.af.auth.createUserWithEmailAndPassword(u.email, u.senha);
  }
}
