import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TwitterConfigurationComponent } from './twitter-configuration.component';
import { TwitterApiComponent } from './twitter-api/twitter-api.component';
import { TwitterAttributeComponent } from './twitter-attribute/twitter-attribute.component';
import { TwitterAuthComponent } from './twitter-auth/twitter-auth.component';
import { TwitterDatabaseComponent } from './twitter-database/twitter-database.component';
import { TwitterDetailsComponent } from './twitter-details/twitter-details.component';
import { TwitterMediaComponent } from './twitter-media/twitter-media.component';

const routes: Routes = [
  {
    path: "view/:id",
    component: TwitterConfigurationComponent
  },
  {
    path: "twitter-details/:id/:action",
    component: TwitterDetailsComponent
  },
  {
    path: "twitter-details/:id/:action/:uniqueid",
    component: TwitterDetailsComponent
  },
  {
    path: "twitter-auth/:id/:action",
    component:TwitterAuthComponent
  },
  {
    path: "twitter-auth/:id/:action/:uniqueid",
    component:TwitterAuthComponent
  },
  {
    path: "twitter-api/:id/:action",
    component: TwitterApiComponent
  },
  {
    path: "twitter-api/:id/:action/:uniqueid",
    component: TwitterApiComponent
  },
  {
    path: "twitter-media/:id/:action",
    component: TwitterMediaComponent
  },
  {
    path: "twitter-media/:id/:action/:uniqueid",
    component: TwitterMediaComponent
  },
  {
    path: "twitter-database/:id/:action",
    component: TwitterDatabaseComponent
  },
  {
    path: "twitter-database/:id/:action/:uniqueid",
    component: TwitterDatabaseComponent
  },
  {
    path: "twitter-attribute/:id/:action",
    component: TwitterAttributeComponent
  },
  {
    path: "twitter-attribute/:id/:action/:uniqueid",
    component: TwitterAttributeComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TwitterConfigurationRoutingModule { }
