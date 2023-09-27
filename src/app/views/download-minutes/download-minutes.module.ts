import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DownloadMinutesPageRoutingModule } from './download-minutes-routing.module';
import { DownloadMinutesPage } from './download-minutes.page';
import { SharePageModule } from 'src/app/share/share.module';
import { MinuteService } from 'src/app/service/minute/minute-service';
import { HttpClientModule } from '@angular/common/http'; 
import { AuthService } from 'src/app/services/auth/auth.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DownloadMinutesPageRoutingModule,
    SharePageModule,
    HttpClientModule,
    
  ],
  declarations: [DownloadMinutesPage],
  providers: [
    MinuteService,AuthService  // Agrega el servicio aquí
  ],
})
export class DownloadMinutesPageModule {}
