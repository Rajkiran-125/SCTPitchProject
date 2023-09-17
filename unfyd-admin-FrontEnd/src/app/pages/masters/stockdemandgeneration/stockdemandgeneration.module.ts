import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { StockdemandgenerationComponent } from './stockdemandgeneration.component';
import { StockdemandgenerationRoutingModule } from './stockdemandgeneration-routing.module';
@NgModule({
  declarations: [ 
    StockdemandgenerationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StockdemandgenerationRoutingModule,
    MaterialModule,
    LoaderModule
  ]
})
export class StockdemandgenerationModule { }
