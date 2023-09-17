import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountRoutingModule } from './account-routing.module'; 
import { AccountComponent } from './account.component'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { ContactInfoViewComponent } from './contact-info-view/contact-info-view.component';
import { ProductInfoViewComponent } from './product-info-view/product-info-view.component';


@NgModule({
  declarations: [
    AccountComponent,
    ContactInfoViewComponent,
    ProductInfoViewComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    MaterialModule,
    LoaderModule,
    FilterModule,
  ]
})
export class AccountModule { }
