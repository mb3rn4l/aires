import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DownloadMinutePageRoutingModule } from './download-minute-routing.module';
import { DownloadMinutesPage } from './download-minute.page';
import { SharePageModule } from 'src/app/share/share.module';
import { MinuteService } from 'src/app/services/minute/minute.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';

@NgModule({
  imports: [
    CommonModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    FormsModule,
    IonicModule,
    DownloadMinutePageRoutingModule,
    SharePageModule,
    HttpClientModule,
  ],
  declarations: [DownloadMinutesPage],
  providers: [MinuteService, AuthService],
})
export class DownloadMinutePageModule {}
