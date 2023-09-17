import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TwitterDmApiComponent } from './twitter-dm-api/twitter-dm-api.component';
import { TwitterDmAttributeComponent } from './twitter-dm-attribute/twitter-dm-attribute.component';
import { TwitterDmAuthComponent } from './twitter-dm-auth/twitter-dm-auth.component';
import { TwitterDmDatabaseComponent } from './twitter-dm-database/twitter-dm-database.component';
import { TwitterDmDetailsComponent } from './twitter-dm-details/twitter-dm-details.component';
import { TwitterDmMediaComponent } from './twitter-dm-media/twitter-dm-media.component';
import { TwitterDmComponent } from './twitter-dm.component';

const routes: Routes = [
  {
    path: "view/:id",
    component: TwitterDmComponent
  },
  {
    path: "twitter-dm-details/:id/:action",
    component: TwitterDmDetailsComponent
  },
  {
    path: "twitter-dm-details/:id/:action/:uniqueid",
    component: TwitterDmDetailsComponent
  },
  {
    path: "twitter-dm-auth/:id/:action",
    component:TwitterDmAuthComponent
  },
  {
    path: "twitter-dm-auth/:id/:action/:uniqueid",
    component:TwitterDmAuthComponent
  },
  {
    path: "twitter-dm-api/:id/:action",
    component: TwitterDmApiComponent
  },
  {
    path: "twitter-dm-api/:id/:action/:uniqueid",
    component: TwitterDmApiComponent
  },
  {
    path: "twitter-dm-media/:id/:action",
    component: TwitterDmMediaComponent
  },
  {
    path: "twitter-dm-media/:id/:action/:uniqueid",
    component: TwitterDmMediaComponent
  },
  {
    path: "twitter-dm-database/:id/:action",
    component: TwitterDmDatabaseComponent
  },
  {
    path: "twitter-dm-database/:id/:action/:uniqueid",
    component: TwitterDmDatabaseComponent
  },
  {
    path: "twitter-dm-attribute/:id/:action",
    component: TwitterDmAttributeComponent
  },
  {
    path: "twitter-dm-attribute/:id/:action/:uniqueid",
    component: TwitterDmAttributeComponent
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TwitterDmRoutingModule { }
