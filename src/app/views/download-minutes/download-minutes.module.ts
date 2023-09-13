import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DownloadMinutesPageRoutingModule } from './download-minutes-routing.module';

import { DownloadMinutesPage } from './download-minutes.page';
import { SharePageModule } from 'src/app/share/share.module';
import { MinuteService } from 'src/app/service/minute-servce';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DownloadMinutesPageRoutingModule,
    SharePageModule
  ],
  declarations: [DownloadMinutesPage],
  providers: [
    MinuteService, // Agrega el servicio aquí
  ],
})
export class DownloadMinutesPageModule {}
