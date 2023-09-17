import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { ConfigManagerComponent } from './config-manager.component';
import { ConfigManagerRoutingModule } from './config-manager-routing.module';
import { OrderModule } from 'ngx-order-pipe';


@NgModule({
    declarations: [
        ConfigManagerComponent
    ],
    imports: [
        CommonModule,
        ConfigManagerRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        Ng2SearchPipeModule,
        NgxPaginationModule,
        MaterialModule,
        LoaderModule,
        OrderModule
    ]
})
export class ConfigManagerModule {}