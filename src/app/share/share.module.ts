import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ContainerCardComponent } from './components/container-card/container-card.component';


@NgModule({
  imports: [
    CommonModule,
    
    IonicModule,
    
  ],
  declarations: [ ContainerCardComponent],
  exports:[ContainerCardComponent]
})
export class SharePageModule {}
