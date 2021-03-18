import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { RootRoutingModule } from './root-routing.module';
import { ShortNumberPipe } from './pipes/pipes'

import {
  RootComponent,
  BestMemeComponent,
  GalleryComponent,
  PopularSubredditsComponent,
  GreetingsComponent,
  ImpressumComponent,
  CommentSectionComponent
} from './components';

@NgModule({
  declarations: [
    RootComponent,
    BestMemeComponent,
    GalleryComponent,
    PopularSubredditsComponent,
    GreetingsComponent,
    ImpressumComponent,
    CommentSectionComponent,
    ShortNumberPipe
  ],
  imports: [
    BrowserModule,
    RootRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    AngularSvgIconModule.forRoot()
  ],
  bootstrap: [RootComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
