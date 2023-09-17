import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';

import { RoleSubtypeComponent } from './role-subtype.component';
import { RoleSubtypeRoutingModule } from './role-subtype-routing.module';


@NgModule({
  declarations: [ 
    RoleSubtypeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RoleSubtypeRoutingModule,
    MaterialModule,
    LoaderModule
  ]
})
export class RoleSubtypeModule { }
