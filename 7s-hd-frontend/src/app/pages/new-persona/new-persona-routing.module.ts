import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewPersonaPage } from './new-persona.page';

const routes: Routes = [
  {
    path: '',
    component: NewPersonaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewPersonaPageRoutingModule {}
