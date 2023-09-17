import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HsmPreviewComponent } from './hsm-preview.component';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';


// DummyDashboardModule,
// CommonModule,
// FilterModule,
// Ng2SearchPipeModule,
// NgxPaginationModule,
// MastersRoutingModule,
// MaterialModule,
// LoaderModule,
// FormsModule,
// ReactiveFormsModule,
// PaymentModule,
// StockModule,
// QrCodeModule,
// WebcamModule,
// ImageCropperModule,
// NgxDocViewerModule,
// DashboardCardModule,
// TileCardModule,
// OrderModule,  
// LabelModule,
// MastersModule,
// UploadLicenseModule,
// HsmPreviewModule,
// HolidaysModule,
// MatIconModule    

@NgModule({
  declarations: [HsmPreviewComponent],
  imports: [
    CommonModule,

// FilterModule,
// RouterModule ,
// MaterialModule,
// LoaderModule,
// FormsModule,
// ReactiveFormsModule,
// MatIconModule,
// BrowserModule,
// HttpClientModule,
// AppRoutingModule,
// BrowserAnimationsModule,
// MatDialogModule, 
  ],
  exports:[  HsmPreviewComponent]
})
export class HsmPreviewModule { }
