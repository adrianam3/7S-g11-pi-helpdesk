import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { NgChartsModule } from 'ng2-charts';
import { PopoverResumenTicketsComponent } from 'src/app/components/popover-resumen-tickets/popover-resumen-tickets.component';


@NgModule({
  
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    NgChartsModule 
  ],
  declarations: [DashboardPage, PopoverResumenTicketsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class DashboardPageModule {}
