import { Component, OnInit } from '@angular/core';
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
    private minutesService: MinuteService,
    private reactiveStore: ReactiveStore
  ) {}

  ngOnInit() {}

  onDiscard(equipmentCode: string) {
    this.minutesService.discardMinute(equipmentCode);
  }
}
