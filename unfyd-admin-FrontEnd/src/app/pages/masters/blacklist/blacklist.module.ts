import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { BlacklistComponent } from './blacklist.component';
import { BlacklistRoutingModule } from './blacklist-routing.module';
@NgModule({
  declarations: [ 
    BlacklistComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BlacklistRoutingModule,
    MaterialModule,
    LoaderModule
  ]
})
export class BlacklistModule { }
