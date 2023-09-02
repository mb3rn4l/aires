import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadMinutasPageRoutingModule } from './upload-minutas-routing.module';

import { UploadMinutasPage } from './upload-minutas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploadMinutasPageRoutingModule
  ],
  declarations: [UploadMinutasPage]
})
export class UploadMinutasPageModule {}
