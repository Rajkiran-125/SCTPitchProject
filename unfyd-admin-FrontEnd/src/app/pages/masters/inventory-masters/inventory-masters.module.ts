import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { InventoryMastersComponent, SanitizeHtmlPipe } from './inventory-masters.component'; 
import { InventoryMastersRoutingModule } from './inventory-masters-routing.module'; 
@NgModule({
  declarations: [ 
    InventoryMastersComponent,
    SanitizeHtmlPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InventoryMastersRoutingModule,
    MaterialModule,
    LoaderModule
  ]
})
export class InventoryMastersModule { }
