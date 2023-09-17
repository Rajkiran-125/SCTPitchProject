import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFunnelApplicationComponent } from './report-funnel-application.component';

describe('ReportFunnelApplicationComponent', () => {
  let component: ReportFunnelApplicationComponent;
  let fixture: ComponentFixture<ReportFunnelApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportFunnelApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportFunnelApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
