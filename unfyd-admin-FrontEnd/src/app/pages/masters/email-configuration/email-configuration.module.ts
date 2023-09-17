import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { EmailConfigurationComponent } from './email-configuration.component';
import  { EmailConfigurationRoutingModule} from '../email-configuration/email-configuration-routing.module'
import { StepsModule } from 'src/app/shared/steps/steps.module';
import { OrderModule } from 'ngx-order-pipe';
import { NgxSummernoteModule } from 'ngx-summernote';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AccountCredentialsComponent } from './account-credentials/account-credentials.component';
import { AttachmentSettingsComponent } from './attachment-settings/attachment-settings.component';
import { CasePropertiesComponent } from './case-properties/case-properties.component';
import { EmailSettingsComponent } from './email-settings/email-settings.component';
import { EmailRoutingComponent } from './email-routing/email-routing.component';
import { EmailEditComponent } from './email-edit/email-edit.component';
import { EmailTemplateComponent } from './email-template/email-template.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    EmailConfigurationComponent,
    AccountCredentialsComponent,
    AttachmentSettingsComponent,
    CasePropertiesComponent,
    EmailSettingsComponent,
    EmailRoutingComponent,
    EmailEditComponent,
    EmailTemplateComponent
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EmailConfigurationRoutingModule,
    MaterialModule,
    LoaderModule,
    StepsModule,
    OrderModule,
    MatDialogModule,
    NgxSummernoteModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    FilterModule
  ],providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    }
 ],exports:[
  EmailConfigurationComponent]
})
export class EmailConfigurationModule{ }
