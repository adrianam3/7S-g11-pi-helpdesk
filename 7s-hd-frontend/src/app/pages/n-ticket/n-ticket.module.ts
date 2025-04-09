import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NTicketPageRoutingModule } from './n-ticket-routing.module';

import { NTicketPage } from './n-ticket.page';
import { QuillModule } from 'ngx-quill';
//import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    NTicketPageRoutingModule,
    QuillModule.forRoot()
  ],
  declarations: [NTicketPage]
})
export class NTicketPageModule {}
