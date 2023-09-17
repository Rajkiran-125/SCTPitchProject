import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination'; 
import { MaterialModule } from 'src/app/global/material.module';
import { StepsModule } from 'src/app/shared/steps/steps.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { AcademicDetailsComponent } from './academic-details/academic-details.component';
import { OtherDetailsComponent } from './other-details/other-details.component';
import { ProfessionalDetailsComponent } from './professional-details/professional-details.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { OrderModule } from 'ngx-order-pipe';
import { EmployeeRoutingModule } from './employee-routing.module';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import { KycComponent } from './kyc/kyc.component';
import { SocialDetailsComponent } from './social-details/social-details.component';


@NgModule({
  declarations: [
    PersonalDetailsComponent,
    AcademicDetailsComponent,
    OtherDetailsComponent,
    ProfessionalDetailsComponent,
    EmployeeDetailsComponent,
    BankDetailsComponent,
    KycComponent,
    SocialDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    EmployeeRoutingModule,
    MaterialModule,
    StepsModule,
    LoaderModule,
    OrderModule,
    FilterModule
  ]
})
export class EmployeeModule { }
