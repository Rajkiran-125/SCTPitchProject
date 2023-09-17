import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeatureControlsRoutingModule } from './feature-controls-routing.module';
import { FeatureControlsComponent } from './feature-controls.component';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import {  NgxMatTimepickerModule} from '@angular-material-components/datetime-picker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@NgModule({
  declarations: [
    FeatureControlsComponent
  ],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    NgxMatTimepickerModule,
    FeatureControlsRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    MatDialogModule,
  ],providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    }
 ],exports:[FeatureControlsComponent]
})
export class FeatureControlsModule { }
