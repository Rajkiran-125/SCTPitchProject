import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DispositionComponent } from './disposition.component';

const routes: Routes = [
  {
    path:'list',
    component:DispositionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DispositionRoutingModule { }
