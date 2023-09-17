import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportHourlyWiseInteractionComponent } from './report-hourly-wise-interaction.component';

describe('ReportHourlyWiseInteractionComponent', () => {
  let component: ReportHourlyWiseInteractionComponent;
  let fixture: ComponentFixture<ReportHourlyWiseInteractionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportHourlyWiseInteractionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportHourlyWiseInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
