import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTrainingComponent } from './report-training.component';

describe('ReportTrainingComponent', () => {
  let component: ReportTrainingComponent;
  let fixture: ComponentFixture<ReportTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportTrainingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
