import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BestMemeComponent } from './best-meme/best-meme.component';
import { GalleryComponent, ShortNumberPipe } from './gallery/gallery.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PopularSubredditsComponent } from './popular-subreddits/popular-subreddits.component';
import { GreetingsComponent } from './greetings/greetings.component';
import { ImpressumComponent } from './impressum/impressum.component';

@NgModule({
  declarations: [
    AppComponent,
    BestMemeComponent,
    GalleryComponent,
    ShortNumberPipe,
    PopularSubredditsComponent,
    GreetingsComponent,
    ImpressumComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    AngularSvgIconModule.forRoot()
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
