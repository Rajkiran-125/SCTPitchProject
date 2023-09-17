import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessUnitsComponent } from './business-units.component';

const routes: Routes = [{
  path: 'add',
  component: BusinessUnitsComponent,
},
{
  path: 'update/:id',
  component: BusinessUnitsComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessUnitsRoutingModule { }
