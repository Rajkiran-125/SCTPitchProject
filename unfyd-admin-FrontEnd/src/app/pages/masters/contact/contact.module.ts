import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactRoutingModule } from './contact-routing.module';
import { ContactComponent } from './contact.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';

import { MaterialModule } from 'src/app/global/material.module';
import { StepsModule } from 'src/app/shared/steps/steps.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderModule } from 'ngx-order-pipe';
import { ContactDetailsModule } from './contact-details/contact-details.module';


@NgModule({
  declarations: [
    ContactComponent,
    
    
  ],
  imports: [
    CommonModule,
    ContactRoutingModule,
    MaterialModule,
    StepsModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    OrderModule,
    ContactDetailsModule
  ]
})
export class ContactModule { }
