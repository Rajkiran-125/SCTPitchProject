import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HubModulesRoutingModule } from './hub-modules-routing.module';
import { HubModulesComponent } from './hub-modules.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { HubModSummaryComponent } from './hub-mod-summary/hub-mod-summary.component';


@NgModule({
  declarations: [
    HubModulesComponent,
    HubModSummaryComponent
  ],
  imports: [
    CommonModule,
    HubModulesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoaderModule
  ]
})
export class HubModulesModule { }
