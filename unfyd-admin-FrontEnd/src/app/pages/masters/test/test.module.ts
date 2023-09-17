import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestRoutingModule } from './test-routing.module';
import { TestComponent } from './test.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { MastersRoutingModule } from '../masters-routing.module';
import { PostmanModule } from 'src/app/components/postman/postman.module';
import { OrderByPipe } from 'src/app/order-by.pipe';
import { OrderModule } from 'ngx-order-pipe';
import { QueryCreationBuilderModule } from 'src/app/components/query-creation-builder/query-creation-builder.module';


@NgModule({
  declarations: [
    TestComponent
  ],
  imports: [
    CommonModule,
    LoaderModule,
    TestRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    QueryCreationBuilderModule,
    OrderModule
  ],
  // ,exports:[TestComponent]
})
export class TestModule { }
