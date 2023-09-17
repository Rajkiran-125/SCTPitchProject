import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleMappingComponent } from './module-mapping.component';

const routes: Routes = [
  {
    path: 'list',
    component: ModuleMappingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuleMappingRoutingModule { }
