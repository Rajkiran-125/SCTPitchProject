import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacebookDetailsComponent } from './facebook-details/facebook-details.component';
import { FacebookConfigurationComponent } from './facebook-configuration.component';
import { FacebookAuthComponent } from './facebook-auth/facebook-auth.component';
import { FacebookApiComponent } from './facebook-api/facebook-api.component';
import { FacebookMediaComponent } from './facebook-media/facebook-media.component';
import { FacebookDatabaseComponent } from './facebook-database/facebook-database.component';
import { FacebookAttributeComponent } from './facebook-attribute/facebook-attribute.component';

const routes: Routes = [

  {
    path: "view/:id",
    component: FacebookConfigurationComponent
  },
  {
    path: "facebook-details/:id/:action",
    component: FacebookDetailsComponent
  },
  {
    path: "facebook-details/:id/:action/:uniqueid",
    component: FacebookDetailsComponent
  },
  {
    path: "facebook-auth/:id/:action",
    component:FacebookAuthComponent
  },
  {
    path: "facebook-auth/:id/:action/:uniqueid",
    component:FacebookAuthComponent
  },
  {
    path: "facebook-api/:id/:action",
    component: FacebookApiComponent
  },
  {
    path: "facebook-api/:id/:action/:uniqueid",
    component: FacebookApiComponent
  },
  {
    path: "facebook-media/:id/:action",
    component: FacebookMediaComponent
  },
  {
    path: "facebook-media/:id/:action/:uniqueid",
    component: FacebookMediaComponent
  },
  {
    path: "facebook-database/:id/:action",
    component: FacebookDatabaseComponent
  },
  {
    path: "facebook-database/:id/:action/:uniqueid",
    component: FacebookDatabaseComponent
  },
  {
    path: "facebook-attribute/:id/:action",
    component: FacebookAttributeComponent
  },
  {
    path: "facebook-attribute/:id/:action/:uniqueid",
    component: FacebookAttributeComponent
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacebookConfigurationRoutingModule { }
