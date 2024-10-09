import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardHistoryPageRoutingModule } from './dashboard-history-routing.module';

import { DashboardHistoryPage } from './dashboard-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardHistoryPageRoutingModule
  ],
  declarations: [DashboardHistoryPage]
})
export class DashboardHistoryPageModule {}
