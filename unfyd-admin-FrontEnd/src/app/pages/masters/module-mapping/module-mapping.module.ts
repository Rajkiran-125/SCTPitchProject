import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { ModuleMappingRoutingModule } from './module-mapping-routing.module';
import { ModuleMappingComponent } from './module-mapping.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination'; 


@NgModule({
  declarations: [ 
    ModuleMappingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModuleMappingRoutingModule,
    MaterialModule,
    LoaderModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
  ]
})
export class ModuleMappingModule { }
