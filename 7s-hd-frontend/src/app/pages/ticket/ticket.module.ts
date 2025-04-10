import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TicketPageRoutingModule } from './ticket-routing.module';

import { TicketPage } from './ticket.page';
import { AsignarAgenteComponent } from 'src/app/modals/asignar-agente/asignar-agente.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TicketPageRoutingModule,

  ],
  declarations: [TicketPage, AsignarAgenteComponent]
})
export class TicketPageModule {}
