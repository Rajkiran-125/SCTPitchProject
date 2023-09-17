import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PitchRoutingModule } from './pitch-routing.module';
import { PitchComponent } from './pitch.component';
import { MaterialModule } from 'src/app/global/material.module';
import { PitchDialogModule } from './pitch-dialog/pitch-dialog.module';

@NgModule({
  declarations: [
    PitchComponent
  ],
  imports: [
    CommonModule,
    PitchRoutingModule,
    MaterialModule,
    PitchDialogModule
  ],
})
export class PitchModule { }
