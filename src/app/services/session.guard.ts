import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivate,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class SessionGuard implements CanActivate {
  constructor(private login: LoginService, private route: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // se não tem alguem logado direcionado a
    // tela de login
    if (!this.login.isLogado()) {
      // direciona
      // this.route.navigate(['login']);
      return true;
    } else {
      // permite o acesso
      return true;
    }
  }
}
