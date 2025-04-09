import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NTicketPageRoutingModule } from './n-ticket-routing.module';

import { NTicketPage } from './n-ticket.page';
import { QuillModule } from 'ngx-quill';
//import Quill from 'quill';
//import ImageUploader from 'quill-image-uploader';
// ⚠️ Importa quill-image-uploader forzando compatibilidad
// import * as ImageUploader from 'quill-image-uploader';
// (Quill as any).register('modules/imageUploader', (ImageUploader as any).default);


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    NTicketPageRoutingModule,
    // QuillModule.forRoot({
    //   modules: {
    //     toolbar: [
    //       ['bold', 'italic', 'underline'],
    //       [{ list: 'ordered' }, { list: 'bullet' }],
    //       ['link', 'image'], // Habilita carga de imágenes
    //     ],
    //     clipboard: {
    //       matchVisual: false,
    //     }
    //   }
    // })
    QuillModule.forRoot()
  ],
  declarations: [NTicketPage]
})
export class NTicketPageModule {}
