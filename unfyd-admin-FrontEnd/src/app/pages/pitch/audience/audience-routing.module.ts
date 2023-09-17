import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AudienceComponent } from './audience.component';
import { AudienceListTypeComponent } from './audience-list-type/audience-list-type.component';
import { AudienceDetailsComponent } from './audience-details/audience-details.component';

const routes: Routes = [
  {path : 'add',data:{title:'Add Audience'},loadChildren:()=>import('../audience/add-audience/add-audience.module').then(mod=>mod.AddAudienceModule)},
  {path : 'list', component : AudienceComponent},
  {path : 'list-type/:type', component : AudienceListTypeComponent},
  {path : 'details/:id',data:{title:'audiance-details'},component:AudienceDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AudienceRoutingModule { }
