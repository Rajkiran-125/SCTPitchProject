import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountsRoutingModule } from './accounts-routing.module';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';


@NgModule({
    declarations: [],
    imports: [CommonModule,AccountsRoutingModule, FormsModule, ReactiveFormsModule, MaterialModule, LoaderModule],
})
export class AccountsModule {}
