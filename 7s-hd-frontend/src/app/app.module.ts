import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';

// IMPORTACIÓN GLOBAL DE QUILL
import Quill from 'quill';
// import ImageResize from 'quill-image-resize-module';
// import ImageUploader from 'quill-image-uploader';


// Quill.register('modules/imageResize', ImageResize);
// Quill.register('modules/imageUploader', ImageUploader);

@NgModule({
  declarations: [AppComponent,
  ],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
