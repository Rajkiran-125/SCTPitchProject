import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostmanRoutingModule } from './postman-routing.module';
import { PostmanComponent } from './postman.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderModule } from 'ngx-order-pipe';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { StepsModule } from 'src/app/shared/steps/steps.module';


@NgModule({
  declarations: [
    PostmanComponent
  ],
  imports: [
    CommonModule,
    PostmanRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoaderModule,
    StepsModule,
    OrderModule
  ],exports:[PostmanComponent]
})
export class PostmanModule { }
