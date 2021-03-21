import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  ImpressumComponent,
  BestMemeComponent
} from './components';
import { ExperimentalGalleryComponent } from './experimental-gallery/experimental-gallery.component';

const routes: Routes = [
  { path: '', component: BestMemeComponent },
  { path: 'impressum', component: ImpressumComponent },
  { path: 'test', component: ExperimentalGalleryComponent },
  { path: 'r/:subreddit', component: BestMemeComponent },
  { path: '**',   redirectTo: '/', }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RootRoutingModule { }
