import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationsComponent } from './notifications.component';

const routes: Routes = [
  {
    path: 'view',
    component: NotificationsComponent,
  },
  {
    path: 'add',
    component: NotificationsComponent,
  },
  {
    path: 'update/:id',
    component: NotificationsComponent,
  },
  {
    path: 'summary/:id',
    component: NotificationsComponent,
  },
  {
    path: 'edit/:id',
    component: NotificationsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsRoutingModule { }