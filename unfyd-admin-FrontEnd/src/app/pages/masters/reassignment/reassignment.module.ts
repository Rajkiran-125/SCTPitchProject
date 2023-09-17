import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReassignmentRoutingModule } from './reassignment-routing.module';
import { ReassignmentComponent } from './reassignment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { MastersRoutingModule } from '../masters-routing.module';


@NgModule({
  declarations: [
    ReassignmentComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    FilterModule,
    MaterialModule,
    LoaderModule,
    ReassignmentRoutingModule
  ]
})
export class ReassignmentModule { }
