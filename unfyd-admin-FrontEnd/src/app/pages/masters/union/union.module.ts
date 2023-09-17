import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnionRoutingModule } from './union-routing.module';
import { UnionComponent } from './union.component';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { MaterialModule } from 'src/app/global/material.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  } from 'mat-select-filter';
@NgModule({
    declarations: [UnionComponent],
    imports: [
        CommonModule,
        UnionRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        Ng2SearchPipeModule,
        NgxPaginationModule,
        MaterialModule,
        LoaderModule,
    ],
})
export class UnionModule {}
