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
import { ExperimentalGalleryComponent } from './experimental-gallery/experimental-gallery.component';
import { MediaWrapperComponent } from './media-wrapper/media-wrapper.component';
import { ImageComponent } from './media-wrapper/image/image.component';
import { MediaDirective } from './media-wrapper/media.directive';
import { ControlsComponent } from './controls/controls.component';
import { VideoComponent } from './media-wrapper/video/video.component';
import { IframeComponent } from './media-wrapper/iframe/iframe.component';
import { TextComponent } from './media-wrapper/text/text.component';
import { RecommendationsComponent } from './recommendations/recommendations.component';
import { SearchbarComponent } from './searchbar/searchbar.component';

@NgModule({
  declarations: [
    RootComponent,
    BestMemeComponent,
    GalleryComponent,
    PopularSubredditsComponent,
    GreetingsComponent,
    ImpressumComponent,
    CommentSectionComponent,
    ShortNumberPipe,
    ExperimentalGalleryComponent,
    MediaWrapperComponent,
    ImageComponent,
    MediaDirective,
    ControlsComponent,
    VideoComponent,
    IframeComponent,
    TextComponent,
    RecommendationsComponent,
    SearchbarComponent
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
