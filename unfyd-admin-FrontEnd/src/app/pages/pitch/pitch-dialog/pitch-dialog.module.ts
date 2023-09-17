import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PitchDialogRoutingModule } from './pitch-dialog-routing.module';
import { PitchDialogComponent } from './pitch-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { PitchFilterModule } from '../pitch-filter/pitch-filter.module';
import { PitchTableModule } from '../pitch-table/pitch-table.module';



@NgModule({
  declarations: [
    PitchDialogComponent
  ],
  imports: [
    PitchDialogRoutingModule,
    CommonModule,
    FilterModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    MaterialModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    PitchFilterModule,
    PitchTableModule,
  ]
})
export class PitchDialogModule { }
