import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApiConsoleComponent } from './api-demo.component';

const routes: Routes = [
  {
    path: 'view',
    component: ApiConsoleComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApiDemoRoutingModule { }
