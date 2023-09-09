import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadMinutesPageRoutingModule } from './upload-minutes-routing.module';

import { UploadMinutesPage } from './upload-minutes.page';
import { SharePageModule } from 'src/app/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploadMinutesPageRoutingModule,
    SharePageModule
  ],
  declarations: [UploadMinutesPage]
})
export class UploadMinutesPageModule {}
