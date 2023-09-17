import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VoiceConfigurationComponent } from './voice-configuration.component';
import { VoiceDetailComponent } from '../voice-detail/voice-detail/voice-detail.component';
import { VoiceServiceComponent } from '../voice-service/voice-service/voice-service.component';
import { TelepathyActionComponent } from '../telepathy-action/telepathy-action/telepathy-action.component';

const routes: Routes = [
    
  {
    path: "voice-detail/:id/:action",
    component: VoiceDetailComponent
  },
  {
    path: "voice-detail/:id/:action/:uniqueid",
    component: VoiceDetailComponent
  },
  {
    path: "voice-service/:id/:action/:uniqueid",
    component: VoiceServiceComponent
  },
  {
    path: "voice-service/:id/:action",
    component: VoiceServiceComponent
  },
  {
    path: "telepathy-action/:id/:action/:uniqueid",
    component: TelepathyActionComponent
  },
  {
    path: "telepathy-action/:id/:action",
    component: TelepathyActionComponent
  },
  
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VoiceConfigurationRoutingModule { }
