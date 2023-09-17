import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { OtherDetailsComponent } from './other-details/other-details.component';
import { KycComponent } from './kyc/kyc.component';
import { HawkerDetailsComponent } from './hawker-details/hawker-details.component';
import { PccDetailsComponent } from './pcc-details/pcc-details.component';
import { MedicalDetailsComponent } from './medical-details/medical-details.component';
import { TrainingDetailsComponent } from './training-details/training-details.component';

const routes: Routes = [
  {
    path: 'personal-details',
    component: PersonalDetailsComponent,
    data : { title: 'Personal Details'}
  },
  {
    path: 'personal-details/:id',
    component: PersonalDetailsComponent,
    data : { title: 'Personal Details'}
  },
  {
    path: 'contact-details/:id',
    component: ContactDetailsComponent,
    data : { title: 'Contact Details'}
  },
  {
    path: 'other-details/:id',
    component: OtherDetailsComponent,
    data : { title: 'Other Details'}
  },
  {
    path: 'documents/:id',
    component: KycComponent,
    data : { title: 'Documents'}
  },
  {
    path: 'details/:type/:id',
    component: HawkerDetailsComponent,
    data : { title: 'Details'}
  },
  {
    path: 'pcc-details/:id',
    component: PccDetailsComponent,
    data : { title: 'Pcc Details'}
  },
  {
    path: 'medical-details/:id',
    component: MedicalDetailsComponent,
    data : { title: 'Medical Details'}
  },
  {
    path: 'training-details/:id',
    component: TrainingDetailsComponent,
    data : { title: 'Training Details'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HawkersRoutingModule { }
