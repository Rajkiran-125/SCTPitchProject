import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BatchComponent } from './batch.component';

const routes: Routes = [
  {
    path: "add",
    component: BatchComponent,
  },
  {
    path: "update/:id",
    component: BatchComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BatchRoutingModule { }
