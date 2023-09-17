import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountryComponent } from './country.component';


const routes: Routes = [
  {
    path: 'add',
    component: CountryComponent,
  },
  {
    path: 'update/:id',
    component: CountryComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountryRoutingModule { }
