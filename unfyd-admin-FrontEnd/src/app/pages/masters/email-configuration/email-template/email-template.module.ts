import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSummernoteModule } from 'ngx-summernote';
import { EmailTemplateComponent } from './email-template.component';

@NgModule({
    declarations: [EmailTemplateComponent  ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      Ng2SearchPipeModule,
      NgxPaginationModule,
      MaterialModule,
      LoaderModule,
      NgxSummernoteModule,
    ],
    providers: [],    
  bootstrap: [EmailTemplateComponent],

  exports:[ EmailTemplateComponent ],
  })
  export class EmailTemplateModule { }