import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DamagedstockComponent } from './damagedstock.component';

describe('DamagedstockComponent', () => {
  let component: DamagedstockComponent;
  let fixture: ComponentFixture<DamagedstockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DamagedstockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DamagedstockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
