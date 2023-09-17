import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportInteractionTypeComponent } from './report-interaction-type.component';

describe('ReportInteractionTypeComponent', () => {
  let component: ReportInteractionTypeComponent;
  let fixture: ComponentFixture<ReportInteractionTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportInteractionTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportInteractionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
