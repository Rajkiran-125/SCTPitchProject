import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiDemoRoutingModule } from './api-demo-routing.module';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { ApiConsoleComponent } from './api-demo.component';
import { ApiConsoleExternalModule } from './api-console-external/api-console-external.module';


@NgModule({
  declarations: [ 
    ApiConsoleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ApiDemoRoutingModule,
    MaterialModule,
    LoaderModule,
    ApiConsoleExternalModule
  ]
})
export class ApiConsoleModule { }
