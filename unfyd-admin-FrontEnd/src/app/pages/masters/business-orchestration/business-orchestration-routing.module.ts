import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessOrchestrationComponent } from './business-orchestration.component';

const routes: Routes = [
  {
    path: 'add/:productid',
    component: BusinessOrchestrationComponent
  },
  {
    path: 'update/:productid/:id',
    component: BusinessOrchestrationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessOrchestrationRoutingModule { }

