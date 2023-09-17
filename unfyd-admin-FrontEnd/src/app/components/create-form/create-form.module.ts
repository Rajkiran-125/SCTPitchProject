import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateFormComponent } from './create-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderModule } from 'ngx-order-pipe';
import { MaterialModule } from 'src/app/global/material.module';
import { ApiModuleModule } from 'src/app/shared/api-module/api-module.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { FilterModule } from '../filter/filter.module';



@NgModule({
  declarations: [
    CreateFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    LoaderModule,
    OrderModule,
    FormsModule,
    FilterModule,
    ReactiveFormsModule,
    ApiModuleModule
  ],
  exports:[CreateFormComponent]
})
export class CreateFormModule { }
