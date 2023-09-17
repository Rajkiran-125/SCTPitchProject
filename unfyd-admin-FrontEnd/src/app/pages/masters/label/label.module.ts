import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelRoutingModule } from './label-routing.component';
import { LabelComponent } from './label.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { MastersComponent } from '../masters.component';


@NgModule({
  declarations: [
    LabelComponent,
    // MastersComponent,
  ],
  imports: [
    CommonModule,
    LabelRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    MaterialModule,
    LoaderModule,
  ],
  exports:[
    LabelComponent,
    // MastersComponent
  ]
})
export class LabelModule { }
