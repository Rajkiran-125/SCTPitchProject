import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaskingRuleComponent } from './masking-rule.component';

const routes: Routes = [
  {
    path: 'add',
    component: MaskingRuleComponent,
  },
  {
    path: 'update/:id',
    component: MaskingRuleComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaskingRuleRoutingModule { }
