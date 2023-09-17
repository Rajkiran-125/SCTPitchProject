import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminConfigRoutingModule } from './admin-config-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';


@NgModule({
    declarations: [],
    imports: [CommonModule, AdminConfigRoutingModule, FormsModule, ReactiveFormsModule, MaterialModule, LoaderModule],
})
export class AdminConfigModule {}
