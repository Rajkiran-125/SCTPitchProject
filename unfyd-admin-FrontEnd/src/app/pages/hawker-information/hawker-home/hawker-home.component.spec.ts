import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HawkerHomeComponent } from './hawker-home.component';

describe('HawkerHomeComponent', () => {
  let component: HawkerHomeComponent;
  let fixture: ComponentFixture<HawkerHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HawkerHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HawkerHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
