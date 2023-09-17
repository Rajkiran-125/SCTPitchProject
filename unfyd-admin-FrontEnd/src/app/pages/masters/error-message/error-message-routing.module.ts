import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorMessageComponent } from './error-message.component';

const routes: Routes = [
  {
    path: 'add',
    component: ErrorMessageComponent,
  },
  {
    path: 'update/:id',
    component: ErrorMessageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorMessageRoutingModule { }
