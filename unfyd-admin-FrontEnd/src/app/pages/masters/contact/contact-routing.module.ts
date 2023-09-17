import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { ContactComponent } from './contact.component';

const routes: Routes = [
  {
    path: 'add',
    component: ContactComponent,
  },
  {
    path: 'update/:id',
    component:ContactComponent,
  },

  {
    path: 'contact-details/:id',
    loadChildren: () => import('./contact-details/contact-details-routing.module').then(m => m.ContactDetailsRoutingModule),
    component:ContactDetailsComponent
 },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactRoutingModule { }
