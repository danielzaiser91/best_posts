import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BestMemeComponent } from './best-meme/best-meme.component';

const routes: Routes = [
  { path: '', component: BestMemeComponent },
  { path: '**',   redirectTo: '/', }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
