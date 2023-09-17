import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExternalAppRoutingModule } from './external-app-routing.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { ApiModuleModule } from 'src/app/shared/api-module/api-module.module';
import { ExternalAppComponent } from './external-app.component';


@NgModule({
  declarations: [ExternalAppComponent],
  imports: [
    CommonModule,
    ExternalAppRoutingModule,
    LoaderModule,
    ApiModuleModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FilterModule,
  ]
})
export class ExternalAppModule { }
