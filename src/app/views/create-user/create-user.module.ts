import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CreateUserPageRoutingModule } from './create-user-routing.module';
import { CreateUserPage } from './create-user.page';
import { SharePageModule } from 'src/app/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateUserPageRoutingModule,
    SharePageModule
  ],
  declarations: [CreateUserPage ]
})

export class CreateUserPageModule {}