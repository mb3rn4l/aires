import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ContainerCardComponent } from './components/container-card/container-card.component';
import { HeaderLayoutComponent } from './components/header-layout/header-layout.component';
import { RouterModule } from '@angular/router';
import { ValidatorPasswordDirective } from './directives/confirm-password/validator-password.directive';
import { HttpClientModule } from '@angular/common/http';
import { NumericInputDirective } from './directives/numeric-input/numeric-input.directive';
import { FormsModule } from '@angular/forms';

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
    ValidatorPasswordDirective,
    NumericInputDirective,
  ],
  exports: [
    ContainerCardComponent,
    HeaderLayoutComponent,
    ValidatorPasswordDirective,
    NumericInputDirective,
  ],
})
export class SharePageModule {}
