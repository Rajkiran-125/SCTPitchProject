import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExternalAppViewComponent } from './external-app-view.component';

const routes: Routes = [
  {
    path: "view",
    component: ExternalAppViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExternalAppViewRoutingModule { }
