import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureControlsComponent } from './feature-controls.component';

describe('FeatureControlsComponent', () => {
  let component: FeatureControlsComponent;
  let fixture: ComponentFixture<FeatureControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeatureControlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
