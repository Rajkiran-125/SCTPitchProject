import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BreakNotReadyReasonCodesComponent } from './break-not-ready-reason-codes.component';
const routes: Routes = [
    {
        path: 'add',
        component: BreakNotReadyReasonCodesComponent,
      },
      {
        path: 'update/:id',
        component: BreakNotReadyReasonCodesComponent,
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BreakNotReadyReasonCodesRoutingModule { }
