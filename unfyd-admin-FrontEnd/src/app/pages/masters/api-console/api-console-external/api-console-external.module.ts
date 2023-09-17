import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiConsoleExternalRoutingModule } from './api-console-external-routing.module';
import { ApiConsoleExternalComponent } from './api-console-external.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';


@NgModule({
  declarations: [
    ApiConsoleExternalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ApiConsoleExternalRoutingModule,
    MaterialModule,
    LoaderModule,
  ],
  exports:[
    ApiConsoleExternalComponent
  ]
})
export class ApiConsoleExternalModule { }
