import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WebcamModule } from 'ngx-webcam';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ExcelService } from 'src/app/global/excel.service';
import { MaterialModule } from './global/material.module';
import { HeaderComponent } from './shared/header/header.component';
import { AsideComponent } from './shared/aside/aside.component';
import { FooterComponent } from './shared/footer/footer.component';
import { SettingsComponent } from './components/settings/settings.component';
import { OrderModule } from "ngx-order-pipe";
import { RouterModule } from '@angular/router';
import { PrintComponent } from './components/print/print.component';
import { AmountToWordPipe } from './global/amount-to-word.pipe';
import { PaymentModule } from './components/payment/payment.module';
import { StockModule } from 'src/app/components/stock/stock.module';
import { QrCodeModule } from 'ng-qrcode';
// import { NgxEchartsModule } from 'ngx-echarts';
import { NotifierModule } from 'angular-notifier';
import { CurrencyPipe } from '@angular/common';
import { NgxSummernoteModule } from 'ngx-summernote';

import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';
import { AgentStatusComponent } from './pages/unfyd-reports/agent-status/agent-status.component';
import { MatTimepickerModule } from 'mat-timepicker';
import { AddNodeComponent, NewNodeDialog ,AddNodeDialogModule,AddNodeModule} from './shared/treeControl/add-node/add-node.component';
import { EditNodeComponent, EditNodeDialog, EditNodeDialogModule, EditNodeModule } from './shared/treeControl/edit-node/edit-node.component';
import { DeleteNodeComponent ,DeleteNodeModule} from './shared/treeControl/delete-node/delete-node.component';
import { CannedResponsesComponent } from './pages/unfyd-masters/canned-responses/canned-responses.component';
import { DialogModule } from './components/dialog/dialog.module';
import { HighchartsChartModule } from 'highcharts-angular';
import { NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { OrderByPipe } from './order-by.pipe';
import { ReportsModule } from './pages/reports/reports.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { ContactComponent } from './pages/contact/contact.component';
import { MonitorInterceptor } from './monitor.interceptor';
import {MatChipsModule} from '@angular/material/chips';
import { SafePipe } from './safe.pipe';
import { PitchRoutingModule } from './pages/pitch/pitch-routing.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';


// import { AngularEditorModule } from '@kolkov/angular-editor';
//import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";



@NgModule({
  entryComponents: [
    // NewNodeDialog,
    // EditNodeDialog
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    AsideComponent,
    FooterComponent,
    SettingsComponent,
    PrintComponent,
    AmountToWordPipe,
    BreadcrumbComponent,
    AgentStatusComponent,
    CannedResponsesComponent,
    OrderByPipe,
    SafePipe,
    // ContactComponent,


  ],
  imports: [
    NgxMatNativeDateModule,
    AddNodeDialogModule,
    AddNodeModule,
    EditNodeModule,
    EditNodeDialogModule,
    DeleteNodeModule,
 //   NgMultiSelectDropDownModule.forRoot(),

    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    WebcamModule,
    ImageCropperModule,
    NgxDocViewerModule,
    AppRoutingModule,
    MaterialModule,
    NgbModule,
    RouterModule,
    DialogModule,
    PitchRoutingModule,
    OrderModule,
    PaymentModule,
    StockModule,
    QrCodeModule,
    // UnfydReportsModule,
    NotifierModule,
    HighchartsChartModule,
    NgxSummernoteModule,
    ReportsModule,
    MatChipsModule,
    FullCalendarModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    
    // CollectionSummaryModule,
    // NgxEchartsModule.forRoot({
    //   echarts: () => import('echarts')
    // }),
    // MastersModule,
    // UnfydMastersModule
  ],
    providers: [
    MatTimepickerModule,
    Title,
    DatePipe,
    TitleCasePipe,
    ExcelService,
    CurrencyPipe,
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: MonitorInterceptor, 
      multi: true
    },
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: TokenInterceptorService,
    //   multi :true
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


