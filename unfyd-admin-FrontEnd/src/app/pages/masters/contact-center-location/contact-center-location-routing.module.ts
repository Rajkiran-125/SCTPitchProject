import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactCenterLocationComponent } from './contact-center-location.component';

const routes: Routes = [
  {
    path: 'add',
    component: ContactCenterLocationComponent,
  },
  {
    path: 'update/:id',
    component: ContactCenterLocationComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactCenterLocationRoutingModule { }
