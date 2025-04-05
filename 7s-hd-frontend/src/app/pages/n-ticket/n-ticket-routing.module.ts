import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NTicketPage } from './n-ticket.page';

const routes: Routes = [
  {
    path: '',
    component: NTicketPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NTicketPageRoutingModule {}
