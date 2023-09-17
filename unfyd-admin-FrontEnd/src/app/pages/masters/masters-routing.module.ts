import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessOrchestrationModule } from './business-orchestration/business-orchestration.module';
import { MastersComponent } from './masters.component';


const routes: Routes = [
    {
        path: ':type',
        component: MastersComponent,
    },
    {
        path: 'beneficiary',
        data: { title: 'beneficiary' },
        loadChildren: () => import('./hawkers/hawkers.module').then(mod => mod.HawkersModule),
    },
    {
        path: 'payment-collection',
        data: { title: 'Payment Collection' },
        loadChildren: () =>
            import('./payment-collection/payment-collection.module').then(mod => mod.PaymentCollectionModule),
    },

    {
        path: 'beneficiary-complaint',
        data: { title: 'Beneficiary Complaint' },
        loadChildren: () =>
            import('./hawker-complaint/hawker-complaint.module').then(mod => mod.HawkerComplaintModule),
    },
    {
        path: 'reassignment',
        data: { title: 'Reassignment' },
        loadChildren: () =>
            import('./reassignment/reassignment.module').then(mod => mod.ReassignmentModule),
    },
    {
        path: 'skills',
        data: { title: 'Skills' },
        loadChildren: () => import('./skills/skills.module').then(mod => mod.SkillsModule),
    },
    {
      path: 'user-group',
      data: { title: 'UserGroup' },
      loadChildren: () => import('./user-group/user-group.module').then(mod => mod.UserGroupModule),
  },
    {
        path: 'hierarchy',
        data: { title: 'Heirarchy' },
        loadChildren: () => import('./hierarchy/hierarchy.module').then(mod => mod.HierarchyModule),
    },

    {
        path: 'tenant',
        data: { title: 'Tenant' },
        loadChildren: () => import('./tenant/tenant.module').then(mod => mod.TenantModule),
    },
    {
        path: 'contact-center-location',
        data: { title: 'Contact-center-location' },
        loadChildren: () => import('./contact-center-location/contact-center-location.module').then(mod => mod.ContactCenterLocationModule),
    },

    {
        path: 'customerproduct',
        data: { title: 'Product' },
        loadChildren: () => import('./customerproduct/customerproduct.module').then(mod => mod.CustomerproductModule),
    },
    {
        path: 'campaigns',
        data: { title: 'Campaigns' },
        loadChildren: () => import('./campaigns/campaigns.module').then(mod => mod.CampaignsModule),
    },
    {
        path: 'product-group',
        data: { title: 'Product-group' },
        loadChildren: () => import('./product-group/product-group.module').then(mod => mod.ProductGroupModule),
    },
    {
        path: 'break-not-ready-reason-codes',
        data: { title: 'Break Not Ready Reason Codes' },
        loadChildren: () => import('./break-not-ready-reason-codes/break-not-ready-reason-codes.module').then(mod => mod.BreakNotReadyReasonCodesModule),
    },
    {
        path: 'course',
        data: { title: 'Course' },
        loadChildren: () => import('./course/course.module').then(mod => mod.CourseModule),
    },
    {
        path: 'vendor',
        data: { title: 'Vendor' },
        loadChildren: () => import('./vendor-masters/vendor-masters.module').then(mod => mod.VendorMastersModule),
    },
    {
        path: 'product',
        data: { title: 'Product' },
        loadChildren: () => import('./product/product.module').then(mod => mod.ProductModule),
    },
    {
        path: 'training',
        data: { title: 'Training' },
        loadChildren: () => import('./training-masters/training-masters.module').then(mod => mod.TrainingCenterModule),
    },
    {
        path: 'fee',
        data: { title: 'fee' },
        loadChildren: () => import('./fee/fee.module').then(mod => mod.FeeModule),
    },
    {
        path: 'policeStation',
        data: { title: 'policeStation' },
        loadChildren: () => import('./police-station/police-station.module').then(mod => mod.PoliceStationModule),
    },
    {
     path: 'config-manager',
     data: {title: 'Config Manager'},
     loadChildren: () => import('./config-manager/config-manager.module').then(mod => mod.ConfigManagerModule)
    },
    {
        path: 'hospital',
        data: { title: 'hospital' },
        loadChildren: () => import('./hospitalmaster/hospital.module').then(mod => mod.HospitalsModule),
    },
    {
        path: 'trainingCenter',
        data: { title: 'training Center' },
        loadChildren: () => import('./training-center/training-center.module').then(mod => mod.TrainingCenterModule),
    },
    {
        path: 'Union',
        data: { title: 'Union' },
        loadChildren: () => import('./union/union.module').then(mod => mod.UnionModule),
    },
    {
        path: 'vendor-product',
        data: { title: 'Vendor Product' },
        loadChildren: () => import('./vendor-product/vendor-product.module').then(mod => mod.VendorProductModule),
    },
    {
        path: 'vendor-service',
        data: { title: 'Vendor Service' },
        loadChildren: () => import('./vendor-service/vendor-service.module').then(mod => mod.VendorServiceModule),
    },
    {
        path: 'inventory',
        data: { title: 'Inventory' },
        loadChildren: () => import('./inventory-masters/inventory-masters.module').then(mod => mod.InventoryMastersModule),
    },
    // {
    //     path: 'stockaddition',
    //     data: { title: 'Stockaddition' },
    //     loadChildren: () => import('./stockaddition/stockaddition.module').then(mod => mod.StockadditionModule),
    // },
    {
        path: 'stock-issue',
        data: { title: 'Stock Issue' },
        loadChildren: () =>
            import('./stock-issue/stock-issue.module').then(mod => mod.StockIssueModule),
    },
    {path : 'stock',data:{title:'Stock'},loadChildren:()=>import('./stockaddition/stockaddition.module').then(mod=>mod.StockadditionModule)},
    {
        path: 'finance',
        data: { title: 'Finance' },
        loadChildren: () => import('./finance/finance.module').then(mod => mod.FinanceModule),
    },
    {
        path: 'damagedstock',
        data: { title: 'DamagedStock' },
        loadChildren: () => import('./damagedstock/damagedstock.module').then(mod => mod.DamagedstockModule),
    },
    {
        path: 'VendorRefund',
        data: { title: 'VendorRefund' },
        loadChildren: () => import('./vendorrefund/vendorrefund.module').then(mod => mod.VendorrefundModule),
    },
    {
        path: 'employee',
        data: { title: 'Employee' },
        loadChildren: () => import('./employee/employee.module').then(mod => mod.EmployeeModule),
    },
    {
        path : 'demandstock',
        data:{title:'Demand Stock'},
        loadChildren:()=>import('./stockdemandgeneration/stockdemandgeneration.module').then(mod=>mod.StockdemandgenerationModule)},
    {
        path: 'users',
        data: { title: 'Users' },
        loadChildren: () => import('./users/users.module').then(mod => mod.UsersModule),
    },

    {
        path: 'adminConfig',
        data: { title: 'Admin Config' },
        loadChildren: () => import('./admin-config/admin-config.module').then(mod => mod.AdminConfigModule),
    },
    {
        path: 'role',
        data: { title: 'Role' },
        loadChildren: () => import('./role/role.module').then(mod => mod.RoleModule),
    },
    {
        path: 'ProductCenter',
        data: { title: 'Product Center' },
        loadChildren: () => import('./product-center/product-center.module').then(mod => mod.ProductCenterModule),
    },
    {
        path: 'hsn',
        data: { title: 'HSN' },
        loadChildren: () => import('./hsn/hsn.module').then(mod => mod.HsnModule),
    },
    {
        path: 'form',
        data: { title: 'Form' },
        loadChildren: () => import('./form/form.module').then(mod => mod.FormModule),
    },
    {
        path: 'form-event'  ,
        data: { title: 'Form-Event'},
        loadChildren: () => import('./form-event/form-event.module').then(mod => mod.FormEventModule),
    },
    {
        path: 'module-mapping',
        data: { title: 'Module Mapping' },
        loadChildren: () => import('./module-mapping/module-mapping.module').then(mod => mod.ModuleMappingModule),
    },
    {
        path: 'trainer',
        data: { title: 'Trainers' },
        loadChildren: () => import('./trainers/trainers.module').then(mod => mod.TrainersModule),
    },

    {
        path: 'blacklist',
        data: { title: 'Blacklist' },
        loadChildren: () => import('./blacklist/blacklist.module').then(mod => mod.BlacklistModule),
    },
    {
        path: 'state',
        data: { title: 'State' },
        loadChildren: () => import('./state/state.module').then(mod => mod.StateModule),
    },

    {
        path: 'fee-type',
        data: { title: 'Fee-Type' },
        loadChildren: () => import('./fee-type/fee-type.module').then(mod => mod.FeeTypeModule),
    },
    {
        path: 'profile-type',
        data:{ title : 'profile-Type'},
        loadChildren: () => import ('./role-subtype/role-subtype.module').then(mod => mod.RoleSubtypeModule),
    },
    {
        path: 'batch',
        data:{ title : 'Batch'},
        loadChildren: () => import ('./batch/batch.module').then(mod => mod.BatchModule),
    },
    {
        path: 'branding',
        data:{ title : 'Branding'},
        loadChildren: () => import ('./branding/branding.module').then(mod => mod.BrandingModule),
    },
    {
        path: 'channel-configuration',
        data:{ title : 'Channel-Configuration'},
        loadChildren: () => import ('./channel-configuration/channel-configuration.module').then(mod => mod.ChannelConfigurationModule),
    },
    {
        path: 'label',
        data:{ title : 'Label'},
        loadChildren: () => import ('./label/label.module').then(mod => mod.LabelModule),
    },

    {
        path: 'error-message'  ,
        data: { title: 'Error-Message'},
        loadChildren: () => import('./error-message/error-message.module').then(mod => mod.ErrorMessageModule),
    },
    {
        path : 'holidays' ,
        data : {type:'Holidays'},
        loadChildren: () => import('./holidays/holidays.module').then(mod => mod.HolidaysModule),
    },
    {
        path: 'logout-user',
        data:{ title : 'Logout User'},
        loadChildren: () => import ('./logout-user/logout-user.module').then((mod) => mod.LogoutUserModule),
    },
    {
        path: 'feature-controls',
        data:{ title : 'Feature Controls'},
        loadChildren: () => import ('./feature-controls/feature-controls.module').then((mod) => mod.FeatureControlsModule),
    },
    {
        path: 'business-units',
        data:{ title : 'Business Units'},
        loadChildren: () => import ('./business-units/business-units.module').then((mod) => mod.BusinessUnitsModule),
    },
    // {
    //     path: 'greetings',
    //     data:{ title : 'Greetings'},
    //     loadChildren: () => import ('./greetings/greetings.module').then((mod) => mod.GreetingsModule),
    // },
    {
        path: 'greetings',
        data:{ title : 'Greetings'},
        loadChildren: () => import ('./greetings/greetings.module').then(mod => mod.GreetingsModule),

    },
    {
      path: 'data-collection-forms',
      data:{ title : 'data-collection-forms'},
      loadChildren: () => import ('./form-creation/form-creation.module').then(mod => mod.FormCreationModule),
    },
    {
        path: 'quicklinks',
        data:{ title : 'Quick Links'},
        loadChildren: () => import('./quicklinks/quicklinks.module').then((mod) => mod.QuicklinksModule),
    },
    {
        path: 'canned-messages',
        data:{ title : 'Canned Messages'},
        loadChildren: () => import('./canned-message/canned-message.module').then((mod) => mod.CannedMessageModule),
    },
    {
        path: 'my-tasks',
        data:{ title : 'My Tasks'},
        loadChildren: () => import('../masters/my-task/my-task.module').then((mod) => mod.MyTaskModule),
    },
    {
        path: 'task-group',
        data:{ title : 'Task Group'},
        loadChildren: () => import('../masters/task-group/task-group.module').then((mod) => mod.TaskGroupModule),
    },
    {
        path: 'campaign-field-mapping',
        data:{ title : 'Campaign Field Mapping'},
        loadChildren: () => import('../masters/campaign-field-mapping/campaign-field-mapping.module').then((mod) => mod.CampaignFieldMappingModule),
    },
    {
        path: 'email-notification',
        data:{ title : 'Email Notification'},
        loadChildren: () => import('../masters/email-notification/email-notification.module').then((mod) => mod.EmailNotificationModule),
    },
    {
        path: 'email-notification-master',
        data:{ title : 'Email Notification Master'},
        loadChildren: () => import('../masters/email-notification-master/email-notification-master.module').then((mod) => mod.EmailNotificationMasterModule),
    },
    {
        path: 'account',
        data:{ title : 'Account'},
        loadChildren: () => import('../masters/account/account.module').then((mod) => mod.AccountModule),
    },
    {
      path: 'masking-rule',
      data:{ title : 'masking-rule'},
      loadChildren: () => import('../masters/masking-rule/masking-rule.module').then((mod) => mod.MaskingRuleModule),
    },
    {
        path: 'accesscontrols',
        data:{ title : 'Access Controls'},
        loadChildren: () => import('../masters/access-controls/access-controls.module').then((mod) => mod.AccessControlsModule),
    },
    {
        path: 'business-orchestration',
        data:{ title : 'Business Orchestration'},
        loadChildren: () => import('./business-orchestration/business-orchestration.module').then((mod) => mod.BusinessOrchestrationModule)
     },
     {
        path: 'contact',
        loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule)
     },
     {
        path:'reportmaster',
        loadChildren:() => import('./report-master/report-master.module').then(m =>m.ReportMasterModule)
     },

    //  {
    //     path: 'hubModules',
    //     loadChildren: () => import('../masters/hub-modules/hub-modules.module').then(m => m.HubModulesModule)
    //  },

     {
        path: 'hubModules',
        loadChildren: () => import('./hub-modules/hub-modules.module').then(m => m.HubModulesModule)
     },


    {
        path: 'Privilege',
        data:{title :  'Privilege'},
        loadChildren: () => import('../masters/hub-admin-access-controller/hub-admin-access-controller.module').then((mod) => mod.HubAdminAccessControllerModule)
    },
    {
        path: 'accounts',
        data: {title : 'Accounts'},
        loadChildren: () => import('../masters/accounts/accounts.module').then((mod) => mod.AccountsModule)
    },
    {
        path: 'rm-mapping',
        data: {title : 'rm-mapping'},
        loadChildren: () => import('../masters/rm-mapping/rm-mapping.module').then((mod) => mod.RmMappingModule)
    },

    { path: 'BusinessOrchestration', loadChildren: () => import('./business-orchestration/business-orchestration.module').then(m => m.BusinessOrchestrationModule) },
    { path: 'broadcast', loadChildren: () => import('./broadcast/broadcast.module').then(m => m.BroadcastModule) },
    // { path: 'condition', loadChildren: () => import('./business-orchestration/condition/condition.module').then(m => m.ConditionModule) },
    {
        path: 'api-console',
        data: { title: 'ApiDemo' },
        loadChildren: () => import('./api-console/api-demo.module').then(mod => mod.ApiConsoleModule),
    },
    {
        path: 'notifications',
        // data: {tittle: 'Notifications'},
        loadChildren: () => import('./notifications/notifications.module').then(mod => mod.NotificationsModule)
    },
    {
        path : 'event',data: {tittle: 'Events'},
        loadChildren: () => import('./event/event.module').then(mod => mod.EventModule)
    },
    {
        path: 'ScorecardTemplate',
        data:{ title : 'Scorecard Template'},
        loadChildren: () => import('./SCOR/scorecard-template/scorecard-template.module').then((mod) => mod.ScorecardTemplateModule),
    },
    {
        path: 'externalApp',
        data:{ title : 'External-App'},
        loadChildren: () => import('./external-app-view/external-app/external-app.module').then((mod) => mod.ExternalAppModule),
    },
    {
        path: 'externalApp',
        data:{ title : 'External-App-View'},
        loadChildren: () => import('./external-app-view/external-app-view.module').then((mod) => mod.ExternalAppViewModule),
    },
    {
        path: 'schedules',
        data:{ title : 'schedule'},
        loadChildren: () => import('./schedule/schedule.module').then((mod) => mod.ScheduleModule),
    },
    { path: 'api-console-external', loadChildren: () => import('./api-console/api-console-external/api-console-external.module').then(m => m.ApiConsoleExternalModule) },
    { path: 'test', loadChildren: () => import('./test/test.module').then(m => m.TestModule) },
    { path: 'approvals', loadChildren: () => import('./approvals/approvals.module').then(m => m.ApprovalsModule) },
    { path: 'sla', loadChildren: () => import('./sla/sla.module').then(m => m.SlaModule) },
    { path: 'generalsettings', loadChildren: () => import('./general-settings/general-settings.module').then(m => m.GeneralSettingsModule) },
    { path:'scheduler', loadChildren:() => import('./scheduler/scheduler.module').then(mod => mod.SchedulerModule)},
    { path: 'Solution-Manager', loadChildren: () => import('./solution-manager/solution-manager.module').then(m => m.SolutionManagerModule) },
    { path:'structure', loadChildren:() => import('./structure-view/structure-view.module').then(mod => mod.StructureViewModule)},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MastersRoutingModule {}
