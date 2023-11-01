import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { catchError, of } from 'rxjs';
import { ReactiveStore } from 'src/app/app-store';
import { MinuteService } from 'src/app/services/minute/minute.service';

@Component({
  selector: 'app-list-minute',
  templateUrl: './list-minute.page.html',
  styleUrls: ['./list-minute.page.scss'],
})
export class ListMinutePage implements OnInit {
  minutes$ = this.reactiveStore
    .select('minutes')
    .pipe(catchError(() => of([])));

  constructor(
    private loadingCtrl: LoadingController,
    private minutesService: MinuteService,
    private reactiveStore: ReactiveStore
  ) {}

  ngOnInit() {}

  async onDiscard(equipmentCode: string) {
    let loading = await this.loadingCtrl.create();
    loading.present();

    this.minutesService.discardMinute(equipmentCode);

    loading.dismiss();
  }
}
