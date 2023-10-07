import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateReportPageRoutingModule } from './create-report-routing.module';

import { CreateReportPage } from './create-report.page';
import { SharePageModule } from 'src/app/share/share.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateReportPageRoutingModule,
    SharePageModule,
  ],
  declarations: [CreateReportPage],
  bootstrap: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CreateReportPageModule {}
