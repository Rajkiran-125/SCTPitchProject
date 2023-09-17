import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HawkerLoginComponent } from './hawker-login.component';

describe('HawkerLoginComponent', () => {
  let component: HawkerLoginComponent;
  let fixture: ComponentFixture<HawkerLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HawkerLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HawkerLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
