import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorMastersComponent } from './vendor-masters.component';

describe('VendorMastersComponent', () => {
  let component: VendorMastersComponent;
  let fixture: ComponentFixture<VendorMastersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorMastersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
