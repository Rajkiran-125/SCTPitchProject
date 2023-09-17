import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportRepeatCustomersComponent } from './report-repeat-customers.component';

describe('ReportRepeatCustomersComponent', () => {
  let component: ReportRepeatCustomersComponent;
  let fixture: ComponentFixture<ReportRepeatCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportRepeatCustomersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportRepeatCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
