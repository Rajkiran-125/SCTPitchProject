import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CopyHubAdminComponent } from './copy-hub-admin/copy-hub-admin.component';
import {HubAdminAccessControllerComponent} from './hub-admin-access-controller.component';
import { HubSummaryComponent } from './hub-summary/hub-summary.component';


const routes: Routes = [
  {
    path: 'add',
    component: HubAdminAccessControllerComponent,
  },
  {
    path: 'update/:id',
    component:HubAdminAccessControllerComponent
  },
  {
    path: 'hubSummary/:id',
    component:HubSummaryComponent
  },
  {
    path: 'copy/:copyWithId',
    component:HubAdminAccessControllerComponent
    // CopyHubAdminComponent
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HubAdminAccessControllerRoutingModule{

}