import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { OthersComponent } from './others/others.component';
import { ChannelMappingComponent } from './channel-mapping/channel-mapping.component';
import { RolesPermissionComponent } from './roles-permission/roles-permission.component';

const routes: Routes = [
  {
    path: 'add',
    component: UsersComponent,
  },
  {
    path: 'personal-details/update/:id',
    component: UsersComponent,
  },
  {
    path: 'contact-center-details/:id',
    component: OthersComponent,
  },
  {
    path: 'channel-mapping/:id',
    component: ChannelMappingComponent,
  },
  {
    path: 'roles-permission/:id',
    component: RolesPermissionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
