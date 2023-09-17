import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path : 'campaign', data:{title:'Campaign'},loadChildren:()=>import('./campaign/campaign.module').then(mod=>mod.CampaignModule)},
  {path : 'audience', data:{title:'Audience'},loadChildren:()=>import('./audience/audience.module').then(mod=>mod.AudienceModule)},
  {path : 'settings', data:{title:'Settings'},loadChildren:()=>import('./settings/settings.module').then(mod=>mod.SettingsModule)},
  {path : 'templates', data:{title:'Templates'},loadChildren:()=>import('./templates/templates.module').then(mod=>mod.TemplatesModule)},
  {path : 'calendar', data:{title:'calendar'},loadChildren:()=>import('./pitch-calendar/pitch-calendar.module').then(mod=>mod.PitchCalendarModule)},
  {path : 'calendar', data:{title:'calendar'},loadChildren:()=>import('./pitch-calendar2/pitch-calendar2.module').then(mod=>mod.PitchCalendar2Module)},

] 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PitchRoutingModule { }
