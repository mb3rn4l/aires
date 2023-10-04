import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { ContainerCardComponent } from './components/container-card/container-card.component';
import { HeaderLayoutComponent } from './components/header-layout/header-layout.component';
import { HomeCardComponent } from './components/home-card/home-card.component';

import { ValidatorPasswordDirective } from './directives/confirm-password/validator-password.directive';
import { NumericInputDirective } from './directives/numeric-input/numeric-input.directive';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
  ],
  declarations: [
    ContainerCardComponent,
    HeaderLayoutComponent,
    HomeCardComponent,
    ValidatorPasswordDirective,
    NumericInputDirective,
  ],
  exports: [
    ContainerCardComponent,
    HeaderLayoutComponent,
    HomeCardComponent,
    ValidatorPasswordDirective,
    NumericInputDirective,
  ],
})
export class SharePageModule {}
