import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgentesPageRoutingModule } from './agentes-routing.module';

import { AgentesPage } from './agentes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgentesPageRoutingModule
  ],
  declarations: [AgentesPage]
})
export class AgentesPageModule {}
