import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TelegramDetailsComponent } from './telegram-details/telegram-details.component';
import { TelegramComponent } from './telegram.component';
import { TelegramApiComponent } from './telegram-api/telegram-api.component';
import { TelegramAttributeComponent } from './telegram-attribute/telegram-attribute.component';
import { TelegramAuthComponent } from './telegram-auth/telegram-auth.component';
import { TelegramDatabaseComponent } from './telegram-database/telegram-database.component';
import { TelegramMediaComponent } from './telegram-media/telegram-media.component';

const routes: Routes = [

  {
    path: "view/:id",
    component: TelegramComponent
  },
  {
    path: "telegram-details/:id/:action",
    component: TelegramDetailsComponent
  },
  {
    path: "telegram-details/:id/:action/:uniqueid",
    component: TelegramDetailsComponent
  },
  {
    path: "telegram-auth/:id/:action",
    component:TelegramAuthComponent
  },
  {
    path: "telegram-auth/:id/:action/:uniqueid",
    component:TelegramAuthComponent
  },
  {
    path: "telegram-api/:id/:action",
    component: TelegramApiComponent
  },
  {
    path: "telegram-api/:id/:action/:uniqueid",
    component: TelegramApiComponent
  },
  {
    path: "telegram-media/:id/:action",
    component: TelegramMediaComponent
  },
  {
    path: "telegram-media/:id/:action/:uniqueid",
    component: TelegramMediaComponent
  },
  {
    path: "telegram-database/:id/:action",
    component: TelegramDatabaseComponent
  },
  {
    path: "telegram-database/:id/:action/:uniqueid",
    component: TelegramDatabaseComponent
  },
  {
    path: "telegram-attribute/:id/:action",
    component: TelegramAttributeComponent
  },
  {
    path: "telegram-attribute/:id/:action/:uniqueid",
    component: TelegramAttributeComponent
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TelegramRoutingModule { }
