import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { catchError, of } from 'rxjs';

import { ReactiveStore } from 'src/app/app-store';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isAdmin: boolean;

  constructor(
    private reactiveStore: ReactiveStore,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.initialize();
  }

  private async initialize() {
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.reactiveStore
      .select('user')
      .pipe(catchError(() => of(undefined)))
      .subscribe((user: any) => {
        this.isAdmin = user ? user.isAdmin : false;
        console.log('isAdmin', this.isAdmin);
        loading.dismiss();
      });
  }
}
