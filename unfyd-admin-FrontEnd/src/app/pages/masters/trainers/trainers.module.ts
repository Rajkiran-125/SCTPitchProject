import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination'; 
import { MaterialModule } from 'src/app/global/material.module';
import { StepsModule } from 'src/app/shared/steps/steps.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { SocialDetailsComponent } from './social-details/social-details.component';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import { AcademicDetailsComponent } from './academic-details/academic-details.component';
import { OtherDetailsComponent } from './other-details/other-details.component';
import { KycComponent } from './kyc/kyc.component';
import { ProfessionalDetailsComponent } from './professional-details/professional-details.component';
import { TrainerDetailsComponent } from './trainer-details/trainer-details.component';
import { TrainersRoutingModule } from './trainers-routing.module';


@NgModule({
  declarations: [
    PersonalDetailsComponent,
    AcademicDetailsComponent,
    OtherDetailsComponent,
    ProfessionalDetailsComponent,
    TrainerDetailsComponent,
    BankDetailsComponent,
    KycComponent,
    SocialDetailsComponent,
    BankDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    TrainersRoutingModule,
    MaterialModule,
    StepsModule,
    LoaderModule
  ]
})
export class TrainersModule { }
