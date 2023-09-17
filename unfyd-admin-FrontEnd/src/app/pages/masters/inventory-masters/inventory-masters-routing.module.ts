import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryMastersComponent } from './inventory-masters.component'; 

const routes: Routes = [
  {
    path: 'list',
    component: InventoryMastersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryMastersRoutingModule { }
