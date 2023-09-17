import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingCenterRoutingModule } from './training-center-routing.module';
import { TrainingCenterComponent } from './training-center.component';
import { MaterialModule } from 'src/app/global/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    TrainingCenterComponent
  ],
  imports: [
    CommonModule,
    TrainingCenterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    MaterialModule,
    LoaderModule
  ]
})
export class TrainingCenterModule { }
