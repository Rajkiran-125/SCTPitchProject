import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactCenterLocationRoutingModule } from './contact-center-location-routing.module';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { ContactCenterLocationComponent } from './contact-center-location.component';
import { MatDialogModule, MatDialogRef} from '@angular/material/dialog';


@NgModule({
  declarations: [ 
ContactCenterLocationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ContactCenterLocationRoutingModule,
    MaterialModule,
    LoaderModule,
    MatDialogModule
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    },
 ],
  exports:[
    ContactCenterLocationComponent
  ]
})
export class ContactCenterLocationModule { }
