import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { ReactiveStore } from '../../../app-store';

@Component({
  selector: 'app-header-layout',
  templateUrl: './header-layout.component.html',
  styleUrls: ['./header-layout.component.scss'],
})
export class HeaderLayoutComponent {
  userData$ = this.reactiveStore.select('user');

  constructor(
    private authService: AuthService,
    private reactiveStore: ReactiveStore,
    private router: Router
  ) {}

  ngOnInit() {}

  isLoginRoute() {
    return '/login' === this.router.url;
  }

  onClickSignOut() {
    this.authService.signOut();
    this.router.navigate(['/login']);
  }
}
