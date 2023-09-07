import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DownloadMinutasPageRoutingModule } from './download-minutas-routing.module';

import { DownloadMinutasPage } from './download-minutas.page';
import { SharePageModule } from 'src/app/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DownloadMinutasPageRoutingModule,
    SharePageModule
  ],
  declarations: [DownloadMinutasPage]
})
export class DownloadMinutasPageModule {}
