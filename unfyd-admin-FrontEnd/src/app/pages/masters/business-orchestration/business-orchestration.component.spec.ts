import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessOrchestrationComponent } from './business-orchestration.component';

describe('BusinessOrchestrationComponent', () => {
  let component: BusinessOrchestrationComponent;
  let fixture: ComponentFixture<BusinessOrchestrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessOrchestrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessOrchestrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
