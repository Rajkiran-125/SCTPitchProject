import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CustomerproductRoutingModule } from './customerproduct-routing.module';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { CustomerproductComponent } from './customerproduct.component';
import { NgxSummernoteModule } from 'ngx-summernote';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';



@NgModule({
    
  declarations: [CustomerproductComponent],
  imports: [
    CommonModule,
    CustomerproductRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoaderModule,
    NgxSummernoteModule,  
    MatDialogModule

  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    }
 ], exports:[
  CustomerproductComponent
  ]
})
export class CustomerproductModule { }
