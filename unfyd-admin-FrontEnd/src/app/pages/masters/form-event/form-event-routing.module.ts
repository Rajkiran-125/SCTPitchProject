import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormEventComponent } from './form-event.component';
import { EventAddComponent } from './event-add/event-add.component';

const routes: Routes = [
  {
    path: 'list',
    component: FormEventComponent,
  },
  {
    path: 'add',
    component: EventAddComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormEventRoutingModule { }
