import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './accounts.component';
 
const routes: Routes = [
    {
        path: "add",
        component: AccountsComponent,
      },
      {
        path: "update/:id",
        component: AccountsComponent,
      }, 
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class AccountsRoutingModule { }