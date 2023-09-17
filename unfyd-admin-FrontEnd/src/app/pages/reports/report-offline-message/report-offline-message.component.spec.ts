import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportOfflineMessageComponent } from './report-offline-message.component';

describe('ReportFunnelApplicationComponent', () => {
  let component: ReportOfflineMessageComponent;
  let fixture: ComponentFixture<ReportOfflineMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportOfflineMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportOfflineMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
