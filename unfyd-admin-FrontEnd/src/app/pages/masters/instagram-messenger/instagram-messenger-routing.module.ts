import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstagramMessengerApiComponent } from './instagram-messenger-api/instagram-messenger-api.component';
import { InstagramMessengerAttributeComponent } from './instagram-messenger-attribute/instagram-messenger-attribute.component';
import { InstagramMessengerAuthComponent } from './instagram-messenger-auth/instagram-messenger-auth.component';
import { InstagramMessengerDatabaseComponent } from './instagram-messenger-database/instagram-messenger-database.component';
import { InstagramMessengerDetailsComponent } from './instagram-messenger-details/instagram-messenger-details.component';
import { InstagramMessengerMediaComponent } from './instagram-messenger-media/instagram-messenger-media.component';
import { InstagramMessengerComponent } from './instagram-messenger.component';

const routes: Routes = [

  {
    path: "view/:id",
    component: InstagramMessengerComponent
  },
  {
    path: "instagram-post-details/:id/:action",
    component: InstagramMessengerDetailsComponent
  },
  {
    path: "instagram-post-details/:id/:action/:uniqueid",
    component: InstagramMessengerDetailsComponent
  },
  {
    path: "instagram-post-auth/:id/:action",
    component:InstagramMessengerAuthComponent
  },
  {
    path: "instagram-post-auth/:id/:action/:uniqueid",
    component:InstagramMessengerAuthComponent
  },
  {
    path: "instagram-post-api/:id/:action",
    component: InstagramMessengerApiComponent
  },
  {
    path: "instagram-post-api/:id/:action/:uniqueid",
    component: InstagramMessengerApiComponent
  },
  {
    path: "instagram-post-media/:id/:action",
    component: InstagramMessengerMediaComponent
  },
  {
    path: "instagram-post-media/:id/:action/:uniqueid",
    component: InstagramMessengerMediaComponent
  },
  {
    path: "instagram-post-database/:id/:action",
    component: InstagramMessengerDatabaseComponent
  },
  {
    path: "instagram-post-database/:id/:action/:uniqueid",
    component: InstagramMessengerDatabaseComponent
  },
  {
    path: "instagram-post-attribute/:id/:action",
    component: InstagramMessengerAttributeComponent
  },
  {
    path: "instagram-post-attribute/:id/:action/:uniqueid",
    component: InstagramMessengerAttributeComponent
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstagramMessengerRoutingModule { }
