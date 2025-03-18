import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgentesPage } from './agentes.page';

const routes: Routes = [
  {
    path: '',
    component: AgentesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgentesPageRoutingModule {}
