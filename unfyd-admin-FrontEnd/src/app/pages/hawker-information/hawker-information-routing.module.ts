import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HawkerInformationComponent } from './hawker-information.component';

const routes: Routes = [
{
  path:'',
  component:HawkerInformationComponent,
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HawkerInformationRoutingModule { }
