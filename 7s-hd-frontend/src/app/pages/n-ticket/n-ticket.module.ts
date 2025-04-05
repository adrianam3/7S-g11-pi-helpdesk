import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NTicketPageRoutingModule } from './n-ticket-routing.module';

import { NTicketPage } from './n-ticket.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    NTicketPageRoutingModule
  ],
  declarations: [NTicketPage]
})
export class NTicketPageModule {}
