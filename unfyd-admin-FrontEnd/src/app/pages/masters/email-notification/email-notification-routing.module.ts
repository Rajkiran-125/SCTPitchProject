import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditEmailNotifiactionTemplateComponent } from './edit-email-notifiaction-template/edit-email-notifiaction-template.component';
import { EmailNotificationComponent } from './email-notification.component'; 
const routes: Routes = [
  {
    path: 'view',
    component: EmailNotificationComponent,
  },
  {
    path:'editTemplate/:id',
    component: EditEmailNotifiactionTemplateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailNotificationRoutingModule { }
