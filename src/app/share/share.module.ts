import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ContainerCardComponent } from './components/container-card/container-card.component';
import { HeaderLayoutComponent } from './components/header-layout/header-layout.component';
import { RouterModule } from '@angular/router';
import { ValidatorPasswordDirective } from './directives/confirm-password/validator-password.directive';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ],
  declarations: [ ContainerCardComponent, HeaderLayoutComponent, ValidatorPasswordDirective],
  exports:[ContainerCardComponent, HeaderLayoutComponent, ValidatorPasswordDirective]
})
export class SharePageModule {}
