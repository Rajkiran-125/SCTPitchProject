import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockIssueComponent } from './stock-issue.component';

const routes: Routes = [
  {
    path: 'list',
    component: StockIssueComponent,
    data : { title: 'Payment Collection'},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockIssueRoutingModule { }
