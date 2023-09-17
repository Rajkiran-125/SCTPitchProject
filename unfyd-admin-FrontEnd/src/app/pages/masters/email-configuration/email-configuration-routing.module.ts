import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailConfigurationComponent } from './email-configuration.component';
import { AccountCredentialsComponent } from './account-credentials/account-credentials.component';
import { AttachmentSettingsComponent } from './attachment-settings/attachment-settings.component';
import { CasePropertiesComponent } from './case-properties/case-properties.component';
import { EmailSettingsComponent } from './email-settings/email-settings.component';
import { EmailRoutingComponent } from './email-routing/email-routing.component';
import { EmailEditComponent } from './email-edit/email-edit.component';
import { EmailTemplateComponent } from './email-template/email-template.component';

const routes: Routes = [
  {
    path: "view/:id",
    component: EmailConfigurationComponent ,
  },
  {
    path: "email-edit/:id/:action/:uniqueid",
    component: EmailEditComponent,
  },
  {
    path: "account-credentials/:id/:action",
    component: AccountCredentialsComponent
  },
  {
    path: "account-credentials/:id/:action/:uniqueid",
    component: AccountCredentialsComponent
  },
  {
    path: "attachment-settings/:id/:action",
    component: AttachmentSettingsComponent
  },
  {
    path: "attachment-settings/:id/:action/:uniqueid",
    component: AttachmentSettingsComponent
  },
  {
    path: "case-properties/:id/:action",
    component: CasePropertiesComponent
  },
  {
    path: "case-properties/:id/:action/:uniqueid",
    component: CasePropertiesComponent
  },
  {
    path: "email-settings/:id/:action",
    component: EmailSettingsComponent
  },
  {
    path: "email-settings/:id/:action/:uniqueid",
    component: EmailSettingsComponent
  },
  {
    path: "email-routing/:id/:action",
    component: EmailRoutingComponent
  },
  {
    path: "email-routing/:id/:action/:uniqueid",
    component: EmailRoutingComponent
  },
  {
    path: "email-template/add",
    component:EmailTemplateComponent
  },
  {
    path: "email-template/edit",
    component:EmailTemplateComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailConfigurationRoutingModule { }
