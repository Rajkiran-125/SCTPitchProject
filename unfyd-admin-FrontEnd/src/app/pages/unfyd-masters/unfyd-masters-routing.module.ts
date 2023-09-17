import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CannedResponsesComponent } from './canned-responses/canned-responses.component';
import { DispositionComponent } from './disposition/disposition.component';
import { UnfydMasterFormComponent } from './unfyd-master-form/unfyd-master-form.component';
import { UnfydMastersComponent } from './unfyd-masters.component';

const routes: Routes = [
//   {
//     path: '',
//     component: CannedResponsesComponent,
// },
  {
    path: ':type',
    component: UnfydMastersComponent,
},
{
  path: 'business-unit',
  data: { title: 'Business Unit' },
  loadChildren: () => import('./business-unit/business-unit.module').then(mod => mod.BusinessUnitModule),
},
{
  path: 'business-hours',
  data: { title: 'business-unit' },
  loadChildren: () => import('./business-hours/business-hours.module').then(mod => mod.BusinessHoursModule),
},
{
  path: 'dispositions',
  data: { title: 'dispositions' },
  loadChildren: () => import('./disposition/disposition.module').then(mod => mod.DispositionModule),
},
{
path: 'form/:id',
data: { title: 'form' },
// component:UnfydMasterFormComponent
loadChildren: () => import('./unfyd-master-form/unfyd-master-form.module').then(mod => mod.UnfydMasterFormModule),
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnfydMastersRoutingModule { }
