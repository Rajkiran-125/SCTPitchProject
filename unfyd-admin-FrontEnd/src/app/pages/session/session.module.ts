import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import { SlickCarouselModule } from 'ngx-slick-carousel';

import { SessionRoutingModule } from './session-routing.module';
// import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
// import { DynamicFormInputComponent } from 'src/app/components/dynamic-form-input/dynamic-form-input.component';
import {CommonService} from 'src/app/global/common.service';
import { MaterialModule } from 'src/app/global/material.module';
import { LoginComponent } from './login/login.component';
import { ForgotComponent } from './forgot/forgot.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HawkerLoginComponent } from './hawker-login/hawker-login.component';
import { StrengthCheckerComponent } from './password-strength';


@NgModule({
  declarations: [
    // DynamicFormComponent,
    // DynamicFormInputComponent,
    StrengthCheckerComponent,
    LoginComponent,
    ForgotComponent,
    NotFoundComponent,
    HawkerLoginComponent
  ],
  providers: [CommonService],
  imports: [
    CommonModule,
    SlickCarouselModule,
    ReactiveFormsModule,
    SessionRoutingModule,
    MaterialModule
  ]
})
export class SessionModule { }
