import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DownloadMinutasPage } from './download-minutas.page';

const routes: Routes = [
  {
    path: '',
    component: DownloadMinutasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DownloadMinutasPageRoutingModule {}
