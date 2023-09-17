import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination'; 
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { StockModule } from 'src/app/components/stock/stock.module';
import { StockIssueRoutingModule } from './stock-issue-routing.module';
import { StockIssueComponent } from './stock-issue.component';


@NgModule({
  declarations: [
    StockIssueComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    MaterialModule,
    LoaderModule,
    FilterModule,
    StockModule,
    StockIssueRoutingModule
  ]
})
export class StockIssueModule { }
