import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { RmMappingComponent } from './rm-mapping.component';
import { RmMappingRoutingModule } from './rm-mapping-routing.module';


@NgModule({
  declarations: [
    RmMappingComponent
  ],
  imports: [
    CommonModule,
    RmMappingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoaderModule
  ]
})
export class RmMappingModule { }
