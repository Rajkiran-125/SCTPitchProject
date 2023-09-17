import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { EmailNotificationRoutingModule } from './email-notification-routing.module'; 
import { EmailNotificationComponent } from './email-notification.component'; 
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxSummernoteModule } from 'ngx-summernote';
import { EditEmailNotifiactionTemplateComponent } from './edit-email-notifiaction-template/edit-email-notifiaction-template.component';
@NgModule({
  declarations: [ 
    EmailNotificationComponent, EditEmailNotifiactionTemplateComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EmailNotificationRoutingModule,
    MaterialModule,
    Ng2SearchPipeModule,
    LoaderModule,
    NgxSummernoteModule
  ]
})
export class EmailNotificationModule { }
