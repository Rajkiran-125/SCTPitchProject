import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessControlsRoutingModule } from './access-controls-routing.module';
import { AccessControlsComponent } from './access-controls.component';  
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterModule } from 'src/app/components/filter/filter.module';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AccessControlsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    MaterialModule,
    LoaderModule,
    FilterModule
  ]
})
export class AccessControlsModule { }
