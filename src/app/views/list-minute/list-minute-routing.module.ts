import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListMinutePage } from './list-minute.page';

const routes: Routes = [
  {
    path: '',
    component: ListMinutePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListMinutePageRoutingModule {}
