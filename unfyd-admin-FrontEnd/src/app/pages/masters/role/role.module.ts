import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';

import { RoleComponent } from './role.component';
import { RoleRoutingModule } from './role-routing.module';


@NgModule({
  declarations: [ 
    RoleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RoleRoutingModule,
    MaterialModule,
    LoaderModule
  ]
})
export class RoleModule { }
