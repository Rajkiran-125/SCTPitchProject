import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CannedMessageComponent } from './canned-message.component';

const routes: Routes = [
  {
    path:'view',
    component:CannedMessageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CannedMessageRoutingModule { }
