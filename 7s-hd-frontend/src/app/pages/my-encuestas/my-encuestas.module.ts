import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyEncuestasPageRoutingModule } from './my-encuestas-routing.module';

import { MyEncuestasPage } from './my-encuestas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyEncuestasPageRoutingModule
  ],
  declarations: [MyEncuestasPage]
})
export class MyEncuestasPageModule {}
