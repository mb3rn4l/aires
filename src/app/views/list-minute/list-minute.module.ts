import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListMinutePageRoutingModule } from './list-minute-routing.module';

import { ListMinutePage } from './list-minute.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListMinutePageRoutingModule
  ],
  declarations: [ListMinutePage]
})
export class ListMinutePageModule {}
