import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportMasterRoutingModule } from './report-master-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { ReportMasterComponent } from './report-master.component';





@NgModule({
  declarations: [
    ReportMasterComponent,
  ],
  imports: [
    CommonModule,
    ReportMasterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoaderModule,
    MatDialogModule
  ],
})
export class ReportMasterModule { }
