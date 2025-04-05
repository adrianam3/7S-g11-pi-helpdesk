import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewTicketPageRoutingModule } from './new-ticket-routing.module';

import { NewTicketPage } from './new-ticket.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    NewTicketPageRoutingModule
  ],
  declarations: [NewTicketPage]
})
export class NewTicketPageModule {}
