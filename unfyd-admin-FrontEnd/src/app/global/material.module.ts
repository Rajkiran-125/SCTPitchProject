import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { TitleCaseDirective } from 'src/app/global/title-case.directive';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DatePickerFormatDirective } from 'src/app/global/date-picker-format.directive';

import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MatExpansionModule } from '@angular/material/expansion';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxTreeDndModule } from 'ngx-tree-dnd';
import { CdkTreeModule } from '@angular/cdk/tree';
import { CdkTableModule } from '@angular/cdk/table';
import { MatTreeModule } from '@angular/material/tree';
import { MatDividerModule } from '@angular/material/divider';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTimepickerModule } from 'mat-timepicker';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { DateFormatPipe } from './date-format.pipe';
import { DateTimeFormatPipe } from './date-time-format.pipe';
import { TimeformatPipe } from './timeformat.pipe';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSliderModule} from '@angular/material/slider';
import {NgxMatDatetimePickerModule,NgxMatNativeDateModule,NgxMatTimepickerModule} from '@angular-material-components/datetime-picker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WeekPipe } from './week.pipe';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { PitchDateFormatPipe } from './pitch-date-format.pipe';


@NgModule({
    imports: [CommonModule,MatTabsModule],
    exports: [
        TitleCaseDirective,
        MatIconModule,
        MatSliderModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatDialogModule,
        MatMenuModule,
        MatSidenavModule,
        MatListModule,
        MatSnackBarModule,
        MatBadgeModule,
        MatTabsModule,
        MatSlideToggleModule,
        MatRadioModule,
        MatProgressSpinnerModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatSelectFilterModule,
        MatExpansionModule,
        MatMomentDateModule,
        DatePickerFormatDirective,
        DragDropModule,
        NgxTreeDndModule,
        MatTimepickerModule,
        MatButtonToggleModule,
        MatCardModule,
        MatToolbarModule,
        MatDividerModule,
        MatRippleModule,
        MatTreeModule,
        CdkTableModule,
        CdkTreeModule,
        ScrollingModule,
        DateFormatPipe, DateTimeFormatPipe, TimeformatPipe,WeekPipe,
        NgxMatDatetimePickerModule,NgxMatNativeDateModule,NgxMatTimepickerModule,
        NgbModule,
        MatProgressBarModule

    ],
    declarations: [TitleCaseDirective, DatePickerFormatDirective,
       DateFormatPipe, DateTimeFormatPipe, TimeformatPipe, WeekPipe, PitchDateFormatPipe
      ],
    providers: [
        { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
        MatTimepickerModule
    ]
})
export class MaterialModule { }
