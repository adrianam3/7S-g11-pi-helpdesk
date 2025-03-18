import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseConocimientoPage } from './base-conocimiento.page';

const routes: Routes = [
  {
    path: '',
    component: BaseConocimientoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BaseConocimientoPageRoutingModule {}
