import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstagramComponent } from './instagram.component';
import { InstagramApiComponent } from './instagram-api/instagram-api.component';
import { InstagramAttributeComponent } from './instagram-attribute/instagram-attribute.component';
import { InstagramAuthComponent } from './instagram-auth/instagram-auth.component';
import { InstagramDatabaseComponent } from './instagram-database/instagram-database.component';
import { InstagramDetailsComponent } from './instagram-details/instagram-details.component';
import { InstagramMediaComponent } from './instagram-media/instagram-media.component';

const routes: Routes = [

  {
    path: "view/:id",
    component: InstagramComponent
  },
  {
    path: "instagram-details/:id/:action",
    component: InstagramDetailsComponent
  },
  {
    path: "instagram-details/:id/:action/:uniqueid",
    component: InstagramDetailsComponent
  },
  {
    path: "instagram-auth/:id/:action",
    component:InstagramAuthComponent
  },
  {
    path: "instagram-auth/:id/:action/:uniqueid",
    component:InstagramAuthComponent
  },
  {
    path: "instagram-api/:id/:action",
    component: InstagramApiComponent
  },
  {
    path: "instagram-api/:id/:action/:uniqueid",
    component: InstagramApiComponent
  },
  {
    path: "instagram-media/:id/:action",
    component: InstagramMediaComponent
  },
  {
    path: "instagram-media/:id/:action/:uniqueid",
    component: InstagramMediaComponent
  },
  {
    path: "instagram-database/:id/:action",
    component: InstagramDatabaseComponent
  },
  {
    path: "instagram-database/:id/:action/:uniqueid",
    component: InstagramDatabaseComponent
  },
  {
    path: "instagram-attribute/:id/:action",
    component: InstagramAttributeComponent
  },
  {
    path: "instagram-attribute/:id/:action/:uniqueid",
    component: InstagramAttributeComponent
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstagramRoutingModule { }
