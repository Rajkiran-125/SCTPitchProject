import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChannelApiProviderComponent } from './channel-api-provider/channel-api-provider.component';
import { ChannelAttributeMappingComponent } from './channel-attribute-mapping/channel-attribute-mapping.component';


import { ChannelConfigurationEditComponent } from './channel-configuration-edit/channel-configuration-edit.component';
import { ChannelConfigurationComponent } from './channel-configuration.component';
import { ChannelDataManagementComponent } from './channel-data-management/channel-data-management.component';
import { ChannelDatabaseComponent } from './channel-database/channel-database.component';
import { ChannelDetailsComponent } from './channel-details/channel-details.component';
import { ChannelMediaDetailsComponent } from './channel-media-details/channel-media-details.component';
import { ConfigurationAddChannelComponent } from './configuration-add-channel/configuration-add-channel.component';
import { ConfigurationWebchatComponent } from './configuration-webchat/configuration-webchat.component';

import { HsmApiComponent } from './hsm-api/hsm-api.component';
import { HsmTemplateComponent } from './hsm-template/hsm-template.component';
import { EmailConfigurationComponent } from '../email-configuration/email-configuration.component';
import { EmailConfigurationModule } from '../email-configuration/email-configuration.module';
import { VoiceConfigurationComponent } from '../voice configuration/voice-configuration/voice-configuration.component';
import { VoiceConfigurationModule } from '../voice configuration/voice-configuration/voice-configuration.module';
import { FacebookConfigurationComponent } from '../facebook-configuration/facebook-configuration.component';
import { ViberConfigurationComponent } from '../viber-configuration/viber-configuration/viber-configuration.component';
import { InstagramMessengerComponent } from '../instagram-messenger/instagram-messenger.component';
import { InstagramComponent } from '../instagram/instagram.component';
import { TwitterConfigurationComponent } from '../twitter-configuration/twitter-configuration.component';
import { TwitterDmComponent } from '../twitter-dm/twitter-dm.component';
import { FacebookMessengerComponent } from '../facebook-messenger/facebook-messenger.component';
import { TelegramComponent } from '../telegram/telegram.component';

const routes: Routes = [
  {
    path: "view",
    component: ChannelConfigurationComponent,
  },
  {
    path: 'email-configuration',
    // component: EmailConfigurationComponent,
    // data:{ title : 'Email-Configuration'},
    loadChildren: () => import ('../email-configuration/email-configuration.module').then(mod => mod.EmailConfigurationModule),
},
{
  path: 'facebook-configuration',
  loadChildren: () => import ('../facebook-configuration/facebook-configuration.module').then(mod => mod.FacebookConfigurationModule)
},
{
  path: 'facebook-messenger',
  loadChildren: () => import('../facebook-messenger/facebook-messenger.module').then(mod => mod.FacebookMessengerModule)
},
{
  path: 'twitter-configuration',
  loadChildren: () => import ('../twitter-configuration/twitter-configuration.module').then(mod => mod.TwitterConfigurationModule)
},
{
  path: 'twitter-dm',
  loadChildren: () => import ('../twitter-dm/twitter-dm.module').then(mod => mod.TwitterDmModule)
},
{
  path: 'instagram',
  loadChildren: () => import ('../instagram/instagram.module').then(mod => mod.InstagramModule)
},
{
  path: 'instagram-post',
  loadChildren: () => import ('../instagram-messenger/instagram-messenger.module').then(mod => mod.InstagramMessengerModule)
},
{
  path: 'telegram',
  loadChildren: () => import ('../telegram/telegram.module').then(mod => mod.TelegramModule)
},
{
  path: 'voice-configuration',
  loadChildren: () => import('../voice configuration/voice-configuration/voice-configuration.module').then(mod => mod.VoiceConfigurationModule)

},
{
  path: 'viber-configuration',
  loadChildren: () => import('../viber-configuration/viber-configuration/viber-configuration.module').then(mod => mod.ViberConfigurationModule)

},
  {
    path: "channel-configuration-edit/:id/:action/:uniqueid",
    component: ChannelConfigurationEditComponent,
  },
  {
    path: "configuration-add-channel/:id",
    component: ConfigurationAddChannelComponent,
  },
  {
    path: "email-configuration/view/:id",
    component: EmailConfigurationComponent,
  },
  {
    path: "facebook-configuration/view/:id",
    component: FacebookConfigurationComponent,
  },
  {
    path: 'facebook-messenger/view/:id',
    component: FacebookMessengerComponent,
  },
  {
    path: 'instagram/view/:id',
    component: InstagramComponent,
  },
  {
    path: 'instagram-post/view/:id',
    component: InstagramMessengerComponent,
  },
  {
    path: 'twitter-configuration/view/:id',
    component: TwitterConfigurationComponent,
  },
  {
    path: 'twitter-dm/view/:id',
    component: TwitterDmComponent,
  }, {
    path: 'telegram/view/:id',
    component: TelegramComponent,
  },
  {
    path: "voice-configuration/view/:id",
    component: VoiceConfigurationComponent ,
  },
  {
    path: "channel-details/:id/:action",
    component: ChannelDetailsComponent,
  },
  {
    path: "channel-details/:id/:action/:uniqueid",
    component: ChannelDetailsComponent,
  },
  {
    path: "channel-database/:id/:action/:uniqueid",
    component: ChannelDatabaseComponent,
  },
  {
    path: "hsm-api/:id/:action/:uniqueid",
    component: HsmApiComponent,
  },
  {
    path: "channel-data-management/:id/:action/:uniqueid",
    component: ChannelDataManagementComponent,
  }, {
    path: "channel-api-provider/:id/:action/:uniqueid",
    component: ChannelApiProviderComponent,
  },
  {
    path: "channel-media-details/:id/:action/:uniqueid",
    component: ChannelMediaDetailsComponent,
  },
  {
    path: "channel-attribute-mapping/:id/:action/:uniqueid",
    component: ChannelAttributeMappingComponent,
  },
  {
    path: 'configuration-webchat/:id',
    // loadChildren: () => import('./configuration-webchat/configuration-webchat.module').then(mod => mod.ConfigurationWebchatModule),
    component:ConfigurationWebchatComponent
  },
  {
    path: 'configuration-webchat/:id/:action/:uniqueid',
    // loadChildren: () => import('./configuration-webchat/configuration-webchat.module').then(mod => mod.ConfigurationWebchatModule),
    component:ConfigurationWebchatComponent
  },
  {
    path: 'configuration-add-channel',
    component: ConfigurationAddChannelComponent,
  },
  {
    path: "hsm-template/add",
    component: HsmTemplateComponent,
  },
  {
    path: "hsm-template/edit",
    component: HsmTemplateComponent,
  },
  {
    path: "hsm-template/view",
    component: HsmTemplateComponent,
  },
  {
    path: "viber-configuration/view/:id",
    component: ViberConfigurationComponent ,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChannelConfigurationRoutingModule { }
