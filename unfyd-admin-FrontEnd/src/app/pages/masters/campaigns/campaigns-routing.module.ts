import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampaignsComponent } from './campaigns.component';

const routes: Routes = [
    {
        path: 'add',
        component:  CampaignsComponent,
        
      },
      {
        path: 'update/:id',
        component:  CampaignsComponent,
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampaignsRoutingModule { }
