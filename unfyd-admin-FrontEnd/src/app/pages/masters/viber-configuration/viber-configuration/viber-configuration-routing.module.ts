import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViberDetailsComponent } from '../viber-details/viber-details/viber-details.component';
import { ViberAuthTypeComponent } from '../viber-authType/viber-auth-type/viber-auth-type.component';
import { ViberDataManagementAPIComponent } from '../viber-DataManagementAPI/viber-data-management-api/viber-data-management-api.component';
import { ViberMediaDetailsComponent } from '../viber-mediadetails/viber-media-details/viber-media-details.component';
import { ViberDatabaseComponent } from '../viber-database/viber-database/viber-database.component';
import { ViberAttributeMappingComponent } from '../viber-attributeMapping/viber-attribute-mapping/viber-attribute-mapping.component';

const routes: Routes = [
  {
    path: "viber-details/:id/:action",
    component: ViberDetailsComponent
  },
  {
    path: "viber-details/:id/:action/:uniqueid",
    component: ViberDetailsComponent
  },
  {
    path: "viber-authType/:id/:action/:uniqueid",
    component: ViberAuthTypeComponent
  },
  {
    path: "viber-authType/:id/:action",
    component: ViberAuthTypeComponent
  },
  {
    path: "viber-DataManagementAPI/:id/:action/:uniqueid",
    component: ViberDataManagementAPIComponent
  },
  {
    path: "viber-DataManagementAPI/:id/:action",
    component: ViberDataManagementAPIComponent
  },
  {
    path: "viber-MediaDetails/:id/:action/:uniqueid",
    component: ViberMediaDetailsComponent
  },
  {
    path: "viber-MediaDetails/:id/:action",
    component: ViberMediaDetailsComponent
  },
  {
    path: "viber-database/:id/:action/:uniqueid",
    component: ViberDatabaseComponent
  },
  {
    path: "viber-database/:id/:action",
    component: ViberDatabaseComponent
  },
  {
    path: "viber-attributeMapping/:id/:action/:uniqueid",
    component: ViberAttributeMappingComponent
  },
  {
    path: "viber-attributeMapping/:id/:action",
    component: ViberAttributeMappingComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViberConfigurationRoutingModule { }
