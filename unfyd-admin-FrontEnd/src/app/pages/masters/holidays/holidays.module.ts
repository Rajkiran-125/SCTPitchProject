import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HolidaysComponent } from './holidays.component';
import {HolidaysRoutingModule} from './holidays-routing.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';


@NgModule({
    declarations:[
        HolidaysComponent
    ],
    imports: [
        CommonModule,
        HolidaysRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        LoaderModule
    ],
    exports:[
        HolidaysComponent
    ]
})
export class HolidaysModule{ }