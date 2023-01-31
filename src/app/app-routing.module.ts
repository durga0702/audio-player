import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecorderPageComponent } from './recorder-page/recorder-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'record', pathMatch: 'full' },
  { path: 'record', component: RecorderPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
