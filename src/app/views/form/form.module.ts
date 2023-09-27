import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormPageRoutingModule } from './form-routing.module';
import { SharePageModule } from 'src/app/share/share.module';
import { HttpClientModule } from '@angular/common/http';
import { FormPage } from './form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormPageRoutingModule,
    SharePageModule,
    HttpClientModule   
  ],
  declarations: [FormPage]
})
export class FormPageModule {}
