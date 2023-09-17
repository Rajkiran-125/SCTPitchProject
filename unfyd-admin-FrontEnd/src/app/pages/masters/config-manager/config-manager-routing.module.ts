import {NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigManagerComponent } from './config-manager.component';

const routes: Routes = [
    {
    path: "view",
    component : ConfigManagerComponent,
    }
]


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConfigManagerRoutingModule {

}