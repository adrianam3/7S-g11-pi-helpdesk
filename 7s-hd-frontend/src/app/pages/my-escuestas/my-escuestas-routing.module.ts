import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyEscuestasPage } from './my-escuestas.page';

const routes: Routes = [
  {
    path: '',
    component: MyEscuestasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyEscuestasPageRoutingModule {}
