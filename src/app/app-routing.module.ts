import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BestMemeComponent } from './best-meme/best-meme.component';
import { ImpressumComponent } from './impressum/impressum.component';

const routes: Routes = [
  { path: '', component: BestMemeComponent },
  { path: 'impressum', component: ImpressumComponent },
  { path: '**',   redirectTo: '/', }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
