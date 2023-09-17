import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockadditionComponent } from './stockaddition.component';
const routes: Routes = [
  {
    path: 'add',
    component: StockadditionComponent,
  },
  {
    path: 'update/:id',
    component: StockadditionComponent,
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockadditionRoutingModule { }
