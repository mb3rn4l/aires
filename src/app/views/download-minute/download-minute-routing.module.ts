import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DownloadMinutesPage } from './download-minute.page';

const routes: Routes = [
  {
    path: '',
    component: DownloadMinutesPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DownloadMinutePageRoutingModule {}
