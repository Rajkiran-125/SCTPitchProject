import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockdemandgenerationComponent } from './stockdemandgeneration.component';
const routes: Routes = [
  {
    path: 'add',
    component: StockdemandgenerationComponent,
  },
  {
    path: 'update/:id',
    component: StockdemandgenerationComponent,
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockdemandgenerationRoutingModule { }
