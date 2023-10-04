import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Subscription, catchError, of } from 'rxjs';

import { ReactiveStore } from 'src/app/app-store';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isAdmin: boolean;
  loading: HTMLIonLoadingElement;

  userSubsc: Subscription;

  constructor(
    private reactiveStore: ReactiveStore,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.initialize();
  }

  ngOnDestroy() {
    this.userSubsc.unsubscribe();
  }

  private async initialize() {
    this.loading = await this.loadingCtrl.create();
    this.loading.present();

    this.userSubsc = this.reactiveStore
      .select('user')
      .pipe(catchError(() => of(undefined)))
      .subscribe((user: any) => {
        this.isAdmin = user ? user.isAdmin : false;
        console.log('isAdmin', this.isAdmin);
        this.loading.dismiss();
      });
  }
}
