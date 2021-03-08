import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BestMemeComponent } from './best-meme/best-meme.component';
import { GalleryComponent, ShortNumberPipe } from './gallery/gallery.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PopularSubredditsComponent } from './popular-subreddits/popular-subreddits.component';

@NgModule({
  declarations: [
    AppComponent,
    BestMemeComponent,
    GalleryComponent,
    ShortNumberPipe,
    PopularSubredditsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
