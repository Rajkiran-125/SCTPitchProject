import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViberDetailsComponent } from './viber-details.component';

describe('ViberDetailsComponent', () => {
  let component: ViberDetailsComponent;
  let fixture: ComponentFixture<ViberDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViberDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViberDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
