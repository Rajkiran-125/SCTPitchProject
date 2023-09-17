import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeatureControlsComponent } from './feature-controls.component';

const routes: Routes = [
  {
    path:'list',
    component:FeatureControlsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureControlsRoutingModule { }
