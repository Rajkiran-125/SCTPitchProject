import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogoutUserComponent } from './logout-user.component';

const routes: Routes = [
  {
    path: 'list',
    component: LogoutUserComponent,
    data : { title: 'Logout User'},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogoutUserRoutingModule { }
