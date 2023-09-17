import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotComponent } from './forgot/forgot.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HawkerLoginComponent } from './hawker-login/hawker-login.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: LoginComponent
  // },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'beneficiary-login',
    component: HawkerLoginComponent
  },
  {
    path: 'forgot',
    component: ForgotComponent,
  },
  // {
  //   path: '**',
  //   component: NotFoundComponent,
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SessionRoutingModule { }
