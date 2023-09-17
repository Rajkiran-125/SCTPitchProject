import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DispositionRoutingModule } from './disposition-routing.module';
import { DispositionComponent } from './disposition.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';


@NgModule({
  declarations: [ DispositionComponent ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    FilterModule,
    MaterialModule,
    LoaderModule,
    DispositionRoutingModule
  ]
})
export class DispositionModule { }
