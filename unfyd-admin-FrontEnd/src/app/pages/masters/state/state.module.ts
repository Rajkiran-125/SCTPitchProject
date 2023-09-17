import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { StateComponent } from './state.component';
import { StateRoutingModule } from './state-routing.module';
@NgModule({
  declarations: [ 
    StateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StateRoutingModule,
    MaterialModule,
    LoaderModule
  ]
})
export class StateModule { }
