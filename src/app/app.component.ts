import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { MinuteService } from './services/minute/minute.service';
import { Storage } from '@ionic/storage-angular';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private minuteService: MinuteService, private storage: Storage) {}

  ngOnInit() {
    console.log('APP COMPONENT INIT');
    this.initializeApp();
  }

  async initializeApp() {
    await this.storage.create();
    await this.minuteService.loadMinutes();
  }
}
