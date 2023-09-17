import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorrefundComponent } from './vendorrefund.component';

describe('VendorrefundComponent', () => {
  let component: VendorrefundComponent;
  let fixture: ComponentFixture<VendorrefundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorrefundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorrefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
