import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyEncuestasPage } from './my-encuestas.page';

const routes: Routes = [
  {
    path: '',
    component: MyEncuestasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyEncuestasPageRoutingModule {}
