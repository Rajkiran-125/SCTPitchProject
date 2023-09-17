import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PitchTemplateComponent } from './pitch-template/pitch-template.component';

const routes: Routes = [
  {path : 'add',data:{title:'Add-Templates'},component:PitchTemplateComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplatesRoutingModule { }
