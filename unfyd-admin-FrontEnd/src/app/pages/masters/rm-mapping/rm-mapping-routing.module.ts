import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RmMappingComponent } from './rm-mapping.component';

const routes: Routes = [
  {
    path: 'add',
    component: RmMappingComponent,
  },
  {
    path: 'update/:id',
    component: RmMappingComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RmMappingRoutingModule { }