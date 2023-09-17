import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HawkerHomeComponent } from './hawker-home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { HawkerGrievancesModule } from '../hawker-grievances/hawker-grievances.module';
@NgModule({
  declarations: [
    HawkerHomeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HawkerGrievancesModule,
    MaterialModule,
    LoaderModule,
    ]
})
export class HawkerHomeModule { }
