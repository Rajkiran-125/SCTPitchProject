import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SolutionManagerRoutingModule } from './solution-manager-routing.module';
import { SolutionManagerComponent } from './solution-manager.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { MaterialModule } from 'src/app/global/material.module';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { NgxSummernoteModule } from 'ngx-summernote';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    SolutionManagerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    MaterialModule,
    NgxSummernoteModule,
    FilterModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    SolutionManagerRoutingModule
  ]
})
export class SolutionManagerModule { }
