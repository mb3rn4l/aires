import { Component } from '@angular/core';
// import { Subscription } from 'rxjs';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  // authStateSubsc: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // this.subscribeToAuth();
  }

  // private subscribeToAuth() {
  // this.authStateSubsc = this.authService.authState$.subscribe();
  // }
}
