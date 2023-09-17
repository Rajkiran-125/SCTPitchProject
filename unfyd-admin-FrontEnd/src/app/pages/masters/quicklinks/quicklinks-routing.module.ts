import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuicklinksComponent } from './quicklinks.component';

const routes: Routes = [
  {
    path: 'add',
    component: QuicklinksComponent,
  },
  {
    path: 'update/:id',
    component: QuicklinksComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuicklinksRoutingModule { }
