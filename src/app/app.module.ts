import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BestMemeComponent } from './best-meme/best-meme.component';
import { GalleryComponent, ShortNumberPipe } from './gallery/gallery.component';

@NgModule({
  declarations: [
    AppComponent,
    BestMemeComponent,
    GalleryComponent,
    ShortNumberPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
