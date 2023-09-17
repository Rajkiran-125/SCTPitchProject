import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GreetingsComponent } from './greetings.component';

const routes: Routes = [
  {
    path: "view",
    component: GreetingsComponent,
  },
  {
    path: "view/:id",
    component: GreetingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GreetingsRoutingModule { }
