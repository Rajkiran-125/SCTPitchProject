import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationsRoutingModule } from './notifications-routing.module'; { }
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { NotificationsComponent } from './notifications.component';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
    declarations: [NotificationsComponent],
    imports: [
        CommonModule,
        NotificationsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        LoaderModule,
        FilterModule,
        Ng2SearchPipeModule,
        NgxPaginationModule,
    ],
})
export class NotificationsModule { }
