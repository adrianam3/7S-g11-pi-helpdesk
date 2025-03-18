import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TicketPageRoutingModule } from './ticket-routing.module';

import { TicketPage } from './ticket.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TicketPageRoutingModule,

  ],
  declarations: [TicketPage]
})
export class TicketPageModule {}
