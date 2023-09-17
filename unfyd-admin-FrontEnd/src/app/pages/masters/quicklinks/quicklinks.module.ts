  import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { QuicklinksRoutingModule } from './quicklinks-routing.module';
import { QuicklinksComponent } from './quicklinks.component';


@NgModule({
  declarations: [
    QuicklinksComponent
  ],
  imports: [
    CommonModule,
    QuicklinksRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoaderModule
  ]
})
export class QuicklinksModule { }
