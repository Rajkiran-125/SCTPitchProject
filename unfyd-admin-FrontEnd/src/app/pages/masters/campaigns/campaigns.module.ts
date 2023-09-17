import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CampaignsRoutingModule } from './campaigns-routing.module';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { CampaignsComponent } from './campaigns.component';
import { NgxSummernoteModule } from 'ngx-summernote';



@NgModule({
    
  declarations: [CampaignsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoaderModule,
    NgxSummernoteModule,
    CampaignsRoutingModule,

  ]
})
export class CampaignsModule { }
