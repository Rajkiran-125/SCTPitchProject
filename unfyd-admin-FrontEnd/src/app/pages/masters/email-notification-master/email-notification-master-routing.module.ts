import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailNotificationMasterComponent } from './email-notification-master.component'; 
const routes: Routes = [
  {
    path: 'add',
    component: EmailNotificationMasterComponent,
  },
  {
    path: 'update/:id',
    component: EmailNotificationMasterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailNotificationMasterRoutingModule { }
