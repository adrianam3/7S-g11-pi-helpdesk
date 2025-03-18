import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewPersonaPageRoutingModule } from './new-persona-routing.module';

import { NewPersonaPage } from './new-persona.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    NewPersonaPageRoutingModule
  ],
  declarations: [NewPersonaPage]
})
export class NewPersonaPageModule {}
