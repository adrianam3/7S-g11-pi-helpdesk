import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BaseConocimientoPageRoutingModule } from './base-conocimiento-routing.module';

import { BaseConocimientoPage } from './base-conocimiento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BaseConocimientoPageRoutingModule
  ],
  declarations: [BaseConocimientoPage]
})
export class BaseConocimientoPageModule {}
