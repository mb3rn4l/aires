import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { MinuteService } from './services/minute/minute.service';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from './services/auth/auth.service';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private minuteService: MinuteService,
    private storage: Storage
  ) {}

  ngOnInit() {
    this.initializeApp();
  }

  async initializeApp() {
    this.authService.authState$.subscribe();

    await this.storage.create();
    await this.minuteService.loadMinutes();
  }
}
