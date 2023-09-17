import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StructureViewRoutingModule } from './structure-view-routing.module';
import { StructureViewComponent } from './structure-view.component';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';


@NgModule({
  declarations: [
    StructureViewComponent
  ],
  imports: [
    CommonModule,
    StructureViewRoutingModule,
    MaterialModule,
    LoaderModule,
  ]
})
export class StructureViewModule { }
