import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Form2PageRoutingModule } from './form2-routing.module';

import { Form2Page } from './form2.page';

import { SharePageModule } from 'src/app/share/share.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Form2PageRoutingModule,
    SharePageModule,
    HttpClientModule,
  ],
  declarations: [Form2Page],
})
export class Form2PageModule {}
