import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PccDetailsComponent } from './pcc-details.component';

describe('PccDetailsComponent', () => {
  let component: PccDetailsComponent;
  let fixture: ComponentFixture<PccDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PccDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PccDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
