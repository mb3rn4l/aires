import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadMinutesPage } from './upload-minutes.page';

const routes: Routes = [
  {
    path: '',
    component: UploadMinutesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadMinutesPageRoutingModule {}
