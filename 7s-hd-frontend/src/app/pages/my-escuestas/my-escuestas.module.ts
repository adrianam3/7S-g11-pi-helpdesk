import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyEscuestasPageRoutingModule } from './my-escuestas-routing.module';

import { MyEscuestasPage } from './my-escuestas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyEscuestasPageRoutingModule
  ],
  declarations: [MyEscuestasPage]
})
export class MyEscuestasPageModule {}
