import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { HsnRoutingModule } from './hsn-routing.module';
import { HsnComponent } from './hsn.component';


@NgModule({
  declarations: [ 
    HsnComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HsnRoutingModule,
    MaterialModule,
    LoaderModule
  ]
})
export class HsnModule { }
