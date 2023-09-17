import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScorecardTemplateComponent } from './scorecard-template.component'; 

const routes: Routes = [
  {
    path: 'add',
    component: ScorecardTemplateComponent,
  },
  {
    path: 'update/:id',
    component: ScorecardTemplateComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScorecardTemplateRoutingModule { }
