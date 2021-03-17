import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  ImpressumComponent,
  BestMemeComponent
} from './components';

const routes: Routes = [
  { path: '', component: BestMemeComponent },
  { path: 'impressum', component: ImpressumComponent },
  { path: 'r/:subreddit', component: BestMemeComponent },
  { path: '**',   redirectTo: '/', }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RootRoutingModule { }
