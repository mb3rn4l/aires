import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
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
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  onClickSignOut() {
    // const loading = await this.loadingCtrl.create({
    //   message: '',
    // });

    // try {
    // await loading.present();

    this.authService.signOut();
    // this.authStateSubsc.unsubscribe();
    // } catch (error) {
    // Handle any errors here
    // } finally {
    this.router.navigate(['/login']);
    // await loading.dismiss();
    // }
  }
}
