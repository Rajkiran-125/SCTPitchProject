import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCampaignComponent } from './add-campaign/add-campaign.component';
import { CampaignViewComponent } from './campaign-view/campaign-view.component';
import { CampaignComponent } from './campaign.component';
import { CampaignViewExcelAddComponent } from './campaign-view-excel-add/campaign-view-excel-add.component';

const routes: Routes = [
  {path : 'view/:isChecked/:id',data:{title:'View-Campaign'},component:CampaignViewComponent},
  {path : 'edit/:id',data:{title:'Update-Campaign'},component:AddCampaignComponent},
  {path : 'list',data:{title:'Campaign-List'},component:CampaignComponent},
  {path : 'add',data:{title:'Add-Campaign'},component:AddCampaignComponent},
  {path : 'excelUpload/:isChecked/:id',data:{title:'Excel-Upload'},component:CampaignViewExcelAddComponent},
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampaignRoutingModule { }
