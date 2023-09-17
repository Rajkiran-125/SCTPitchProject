import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogoutUserRoutingModule } from './logout-user-routing.module';
import { LogoutUserComponent } from './logout-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination'; 
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';


@NgModule({
  declarations: [LogoutUserComponent],
  imports: [
    CommonModule,
    LogoutUserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    MaterialModule,
    LoaderModule,
  ]
})
export class LogoutUserModule { }
