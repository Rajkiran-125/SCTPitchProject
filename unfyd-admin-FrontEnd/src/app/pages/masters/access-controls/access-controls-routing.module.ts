import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessControlsComponent } from './access-controls.component';

const routes: Routes = [
  {
    path: "view",
    component: AccessControlsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccessControlsRoutingModule { }
