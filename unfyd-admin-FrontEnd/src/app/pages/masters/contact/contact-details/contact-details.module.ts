import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactDetailsRoutingModule } from './contact-details-routing.module';
import { ContactDetailsComponent } from './contact-details.component';
import { LoaderModule } from "../../../../shared/loader/loader.module";
import { ContactRoutingModule } from '../contact-routing.module';
import { MaterialModule } from 'src/app/global/material.module';
import { StepsModule } from 'src/app/shared/steps/steps.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderModule } from 'ngx-order-pipe';


@NgModule({
    declarations: [
        ContactDetailsComponent
    ],
    imports: [
        CommonModule,
        ContactDetailsRoutingModule,
        LoaderModule,
        ContactRoutingModule,
        MaterialModule,
        StepsModule,
        FormsModule,
        ReactiveFormsModule,
        OrderModule,
        
    ]
})
export class ContactDetailsModule { }
