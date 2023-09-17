import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { CountryRoutingModule } from './country-routing.module';
import { CountryComponent } from './country.component';
@NgModule({
  declarations: [ 
    CountryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CountryRoutingModule,
    MaterialModule,
    LoaderModule
  ]
})
export class CountryModule { }
