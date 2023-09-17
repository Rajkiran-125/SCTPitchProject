import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampaignFieldMappingComponent } from './campaign-field-mapping.component';

const routes: Routes = [{
  path: "view",
  component: CampaignFieldMappingComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampaignFieldMappingRoutingModule { }
