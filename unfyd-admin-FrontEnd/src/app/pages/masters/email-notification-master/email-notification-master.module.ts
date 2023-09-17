import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { EmailNotificationMasterRoutingModule } from './email-notification-master-routing.module'; 
import { EmailNotificationMasterComponent } from './email-notification-master.component'; 
import { Ng2SearchPipeModule } from 'ng2-search-filter';
@NgModule({
  declarations: [ 
    EmailNotificationMasterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EmailNotificationMasterRoutingModule,
    MaterialModule,
    Ng2SearchPipeModule,
    LoaderModule
  ]
})
export class EmailNotificationMasterModule { }
