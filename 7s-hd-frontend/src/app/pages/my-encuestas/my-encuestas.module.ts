import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyEncuestasPageRoutingModule } from './my-encuestas-routing.module';

import { MyEncuestasPage } from './my-encuestas.page';
import { EncuestaModalComponent } from 'src/app/modals/encuesta-modal/encuesta-modal.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyEncuestasPageRoutingModule,
    ReactiveFormsModule,
    EncuestaModalComponent 
  ],
  declarations: [MyEncuestasPage,
    
    ]
})
export class MyEncuestasPageModule {}
