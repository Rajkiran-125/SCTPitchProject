import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddAudienceRoutingModule } from './add-audience-routing.module';
import { AddAudienceComponent } from './add-audience.component';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AddAudienceComponent
  ],
  imports: [
    CommonModule,
    AddAudienceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoaderModule,
  ]
})
export class AddAudienceModule { }
