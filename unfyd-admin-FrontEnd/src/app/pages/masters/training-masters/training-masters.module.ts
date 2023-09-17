import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingMastersRoutingModule } from './training-masters-routing.module';
import { TrainingMastersComponent } from './training-masters.component';
import { MaterialModule } from 'src/app/global/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { SafePipe } from 'src/app/global/safe.pipe';



@NgModule({
  declarations: [
    TrainingMastersComponent,
    SafePipe
  ],
  imports: [
    CommonModule,
    TrainingMastersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    MaterialModule,
    LoaderModule
  ],
  exports: [SafePipe]
})
export class TrainingCenterModule { }
