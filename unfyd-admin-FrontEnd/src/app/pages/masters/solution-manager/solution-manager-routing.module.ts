import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolutionManagerComponent } from './solution-manager.component';

const routes: Routes = [
  { 
    path: 'view', 
    component: SolutionManagerComponent 
  },
  {
    path: 'update/:id',
    component: SolutionManagerComponent,
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolutionManagerRoutingModule { }
