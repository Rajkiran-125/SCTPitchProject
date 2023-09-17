import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventRoutingModule } from './event-routing.module';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { EventComponent } from './event.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';


@NgModule({
  declarations: [ 
    EventComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EventRoutingModule,
    MaterialModule,
    LoaderModule,
    MatDialogModule,
    FilterModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    }
 ], exports:[
  EventComponent
  ]
})
export class EventModule { }
