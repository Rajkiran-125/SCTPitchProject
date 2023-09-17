import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatChipsModule} from '@angular/material/chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/global/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
// import {ChipsInputExample} from '@angular/material/chips/chips-input-example';


@NgModule({
  declarations: [],
  imports: [
    BrowserAnimationsModule,
    MatChipsModule,
    CommonModule,
    MaterialModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [],
})
export class BillingDetailsModule { }
