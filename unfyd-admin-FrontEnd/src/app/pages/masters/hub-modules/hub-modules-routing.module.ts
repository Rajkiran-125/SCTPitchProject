import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HubModSummaryComponent } from './hub-mod-summary/hub-mod-summary.component';
import { HubModulesComponent } from './hub-modules.component';

const routes: Routes = [
  {
    path: 'add',
    component: HubModulesComponent,
  },
  {
    path: 'update/:id',
    component: HubModulesComponent,
  },
  {
    path: 'summary/:id',
    component: HubModSummaryComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HubModulesRoutingModule { }
