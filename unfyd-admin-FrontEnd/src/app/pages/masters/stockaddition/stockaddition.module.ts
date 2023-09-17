import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { StockadditionRoutingModule } from './stockaddition-routing.module';
import { StockadditionComponent } from './stockaddition.component';
@NgModule({
  declarations: [ 
    StockadditionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StockadditionRoutingModule,
    MaterialModule,
    LoaderModule
  ]
})
export class StockadditionModule { }
