import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductGroupRoutingModule } from './product-group-routing.module';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { ProductGroupComponent } from './product-group.component';
import { MatDialogModule, MatDialogRef} from '@angular/material/dialog';

@NgModule({
  declarations: [ ProductGroupComponent],
  imports: [
    CommonModule,
    ProductGroupRoutingModule,   
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoaderModule,
    MatDialogModule
  ], providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    }
 ], exports:[
  ProductGroupComponent
  ]
})
export class ProductGroupModule { }
 