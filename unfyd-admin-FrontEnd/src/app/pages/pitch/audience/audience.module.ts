import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudienceRoutingModule } from './audience-routing.module';
import { AudienceComponent } from '../audience/audience.component';
import { PitchTableModule } from '../pitch-table/pitch-table.module';
import { AudienceListTypeComponent } from './audience-list-type/audience-list-type.component';
import { AudienceListComponent } from './audience-list/audience-list.component';
import { AudienceStructureComponent } from './audience-structure/audience-structure.component';
import { MaterialModule } from 'src/app/global/material.module';
import { MatTabsModule } from '@angular/material/tabs';
import { CreateFormModule } from 'src/app/components/create-form/create-form.module';
import { FormPreviewModule } from '../../masters/form-creation/form-preview/form-preview.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AudienceDetailsComponent } from './audience-details/audience-details.component';
@NgModule({
  declarations: [
    AudienceComponent,
    AudienceListTypeComponent,
    AudienceListComponent,
    AudienceStructureComponent,
    AudienceDetailsComponent
  ],
  imports: [
    CommonModule,
    AudienceRoutingModule,
    PitchTableModule,
    MaterialModule,
    FormPreviewModule,
    CreateFormModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AudienceModule { }
