import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApiConsoleExternalComponent } from './api-console-external.component';

const routes: Routes = [
  { 
    path: 'view', 
    component: ApiConsoleExternalComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApiConsoleExternalRoutingModule { }
