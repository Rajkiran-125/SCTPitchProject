import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemplatesRoutingModule } from './templates-routing.module';
import { PitchTemplateComponent } from './pitch-template/pitch-template.component';
import { MaterialModule } from 'src/app/global/material.module';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { PitchTableModule } from '../pitch-table/pitch-table.module';


@NgModule({
  declarations: [
    PitchTemplateComponent
  ],
  imports: [
    CommonModule,
    TemplatesRoutingModule,
    MaterialModule,
    FilterModule,
    PitchTableModule
  ]
})
export class TemplatesModule { }
