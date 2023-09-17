import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PitchTableRoutingModule } from './pitch-table-routing.module';
import { PitchTableComponent } from './pitch-table.component';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { MaterialModule } from 'src/app/global/material.module';
import { FormsModule } from '@angular/forms';
import { PitchDateFormatPipe } from 'src/app/global/pitch-date-format.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { SafeHtmlDirective } from './safe-html.directive';


@NgModule({
  declarations: [
    PitchTableComponent,
    SafeHtmlPipe,
    SafeHtmlDirective
  ],
  imports: [
    CommonModule,
    FilterModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    PitchTableRoutingModule,
    LoaderModule,
    MaterialModule,
    FormsModule,
    //  PitchDateFormatPipe
  ],

  exports:[PitchTableComponent]
})
export class PitchTableModule { }
