import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { FormEventRoutingModule } from './form-event-routing.module';
import { FormEventComponent } from './form-event.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { EventAddComponent } from './event-add/event-add.component'; 

@NgModule({
  declarations: [ 
    FormEventComponent, EventAddComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormEventRoutingModule,
    MaterialModule,
    LoaderModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
  ]
})
export class FormEventModule { }
