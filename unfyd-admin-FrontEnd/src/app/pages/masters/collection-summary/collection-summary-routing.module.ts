import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionSummaryComponent } from './collection-summary.component';


const routes: Routes = [
  {
    path: 'list',
    component: CollectionSummaryComponent,
    data : { title: 'Collection Summary'},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectionSummaryRoutingModule { }
