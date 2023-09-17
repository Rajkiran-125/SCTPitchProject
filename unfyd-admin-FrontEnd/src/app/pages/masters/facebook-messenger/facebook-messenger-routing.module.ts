import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacebookMessengerComponent } from './facebook-messenger.component';
import { FacebookMessengerDetailsComponent } from './facebook-messenger-details/facebook-messenger-details.component';
import { FacebookMessengerApiComponent } from './facebook-messenger-api/facebook-messenger-api.component';
import { FacebookMessengerAttributeComponent } from './facebook-messenger-attribute/facebook-messenger-attribute.component';
import { FacebookMessengerAuthComponent } from './facebook-messenger-auth/facebook-messenger-auth.component';
import { FacebookMessengerDatabaseComponent } from './facebook-messenger-database/facebook-messenger-database.component';
import { FacebookMessengerMediaComponent } from './facebook-messenger-media/facebook-messenger-media.component';

const routes: Routes = [

  {
    path: "view/:id",
    component: FacebookMessengerComponent
  },
  {
    path: "facebook-messenger-details/:id/:action",
    component: FacebookMessengerDetailsComponent
  },
  {
    path: "facebook-messenger-details/:id/:action/:uniqueid",
    component: FacebookMessengerDetailsComponent
  },
  {
    path: "facebook-messenger-auth/:id/:action",
    component:FacebookMessengerAuthComponent
  },
  {
    path: "facebook-messenger-auth/:id/:action/:uniqueid",
    component:FacebookMessengerAuthComponent
  },
  {
    path: "facebook-messenger-api/:id/:action",
    component: FacebookMessengerApiComponent
  },
  {
    path: "facebook-messenger-api/:id/:action/:uniqueid",
    component: FacebookMessengerApiComponent
  },
  {
    path: "facebook-messenger-media/:id/:action",
    component: FacebookMessengerMediaComponent
  },
  {
    path: "facebook-messenger-media/:id/:action/:uniqueid",
    component: FacebookMessengerMediaComponent
  },
  {
    path: "facebook-messenger-database/:id/:action",
    component: FacebookMessengerDatabaseComponent
  },
  {
    path: "facebook-messenger-database/:id/:action/:uniqueid",
    component: FacebookMessengerDatabaseComponent
  },
  {
    path: "facebook-messenger-attribute/:id/:action",
    component: FacebookMessengerAttributeComponent
  },
  {
    path: "facebook-messenger-attribute/:id/:action/:uniqueid",
    component: FacebookMessengerAttributeComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacebookMessengerRoutingModule { }
