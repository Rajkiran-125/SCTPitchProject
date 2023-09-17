import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryMastersComponent } from './inventory-masters.component';

describe('InventoryMastersComponent', () => {
  let component: InventoryMastersComponent;
  let fixture: ComponentFixture<InventoryMastersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryMastersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
