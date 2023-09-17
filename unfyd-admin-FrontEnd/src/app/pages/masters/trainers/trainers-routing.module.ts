import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { SocialDetailsComponent } from './social-details/social-details.component';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import { AcademicDetailsComponent } from './academic-details/academic-details.component';
import { OtherDetailsComponent } from './other-details/other-details.component';
import { KycComponent } from './kyc/kyc.component';
import { ProfessionalDetailsComponent } from './professional-details/professional-details.component';
import { TrainerDetailsComponent } from './trainer-details/trainer-details.component';

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
    path: 'social-details/:id',
    component: SocialDetailsComponent,
    data : { title: 'Social Details'}
  },
  {
    path: 'bank-details/:id',
    component: BankDetailsComponent,
    data : { title: 'Bank Details'}
  },
  {
    path: 'academic-details/:id',
    component: AcademicDetailsComponent,
    data : { title: 'Academic Details'}
  },
  {
    path: 'professional-details/:id',
    component: ProfessionalDetailsComponent,
    data : { title: 'Professional Details'}
  },
  {
    path: 'other-details/:id',
    component: OtherDetailsComponent,
    data : { title: 'Other Details'}
  },
  {
    path: 'kyc/:id',
    component: KycComponent,
    data : { title: 'KYC'}
   }
   ,
  {
    path: 'details/:type/:id',
    component: TrainerDetailsComponent,
    data : { title: 'Details'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainersRoutingModule { }
