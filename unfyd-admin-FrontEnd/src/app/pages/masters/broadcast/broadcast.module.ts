import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { NgxSummernoteModule } from 'ngx-summernote';
import { BroadcastRoutingModule } from './broadcast-routing.module';
import { BroadcastComponent } from './broadcast.component';
import { FilterModule } from "../../../components/filter/filter.module";
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
    declarations: [
        BroadcastComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        LoaderModule,
        MaterialModule,
        BroadcastRoutingModule,
        NgxSummernoteModule,
        FilterModule,
        Ng2SearchPipeModule,
        NgxPaginationModule,
    ]
})
export class BroadcastModule { }
