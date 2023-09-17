import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HsmApiComponent } from './hsm-api.component';

describe('HsmApiComponent', () => {
  let component: HsmApiComponent;
  let fixture: ComponentFixture<HsmApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HsmApiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HsmApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
