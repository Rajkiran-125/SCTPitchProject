import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationWebchatComponent } from './configuration-webchat.component';


const routes: Routes = [
  // {
  //   path: '',
  //   component:  ConfigurationWebchatComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationWebchatRoutingModule { }
