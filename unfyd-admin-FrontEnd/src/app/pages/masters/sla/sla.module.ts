import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlaRoutingModule } from './sla-routing.module';
import { SlaComponent } from './sla.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';


@NgModule({
  declarations: [
    SlaComponent
  ],
  imports: [
    CommonModule,
    SlaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoaderModule
  ]
})
export class SlaModule { }
