import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockadditionComponent } from './stockaddition.component';

describe('StockadditionComponent', () => {
  let component: StockadditionComponent;
  let fixture: ComponentFixture<StockadditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockadditionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockadditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
