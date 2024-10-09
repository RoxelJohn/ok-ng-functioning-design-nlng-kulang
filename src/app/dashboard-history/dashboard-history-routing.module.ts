import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardHistoryPage } from './dashboard-history.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardHistoryPageRoutingModule {}
