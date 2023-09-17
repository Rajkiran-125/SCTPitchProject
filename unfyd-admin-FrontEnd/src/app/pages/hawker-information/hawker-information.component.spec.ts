import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HawkerInformationComponent } from './hawker-information.component';

describe('HawkerInformationComponent', () => {
  let component: HawkerInformationComponent;
  let fixture: ComponentFixture<HawkerInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HawkerInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HawkerInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
