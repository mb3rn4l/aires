import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ContainerCardComponent } from './components/container-card/container-card.component';
import { HeaderLayoutComponent } from './components/header-layout/header-layout.component';
import { RouterModule } from '@angular/router';
import { ValidatorPasswordDirective } from './directives/confirm-password/validator-password.directive';
import { HttpClientModule } from '@angular/common/http';
import { NumericInputDirective } from './directives/numeric-input/numeric-input.directive';
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha'; 
import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    HttpClientModule,
    RecaptchaModule,
    RecaptchaFormsModule,
  ],
  declarations: [ ContainerCardComponent, HeaderLayoutComponent, ValidatorPasswordDirective, NumericInputDirective],
  exports:[ContainerCardComponent, HeaderLayoutComponent, ValidatorPasswordDirective, NumericInputDirective],
 /*  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.firebase.recaptcha.siteKey
      } as RecaptchaSettings,
    },
    
  ], */
})
export class SharePageModule {}
