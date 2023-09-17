import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { CampaignFieldMappingRoutingModule } from './campaign-field-mapping-routing.module';
import { CampaignFieldMappingComponent } from './campaign-field-mapping.component';
import { FormPreviewModule } from '../form-creation/form-preview/form-preview.module';
import { OrderModule } from 'ngx-order-pipe';

@NgModule({
  declarations: [
    CampaignFieldMappingComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FormPreviewModule,
    OrderModule,
    CampaignFieldMappingRoutingModule
  ]
})
export class CampaignFieldMappingModule { }
