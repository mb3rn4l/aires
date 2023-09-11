import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DownloadMinutesPage } from './download-minutes.page';

const routes: Routes = [
  {
    path: '',
    component: DownloadMinutesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DownloadMinutesPageRoutingModule {}
