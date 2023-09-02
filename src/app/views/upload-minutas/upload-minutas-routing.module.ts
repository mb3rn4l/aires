import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadMinutasPage } from './upload-minutas.page';

const routes: Routes = [
  {
    path: '',
    component: UploadMinutasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadMinutasPageRoutingModule {}
