import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViberMediaDetailsComponent } from './viber-media-details.component';

describe('ViberMediaDetailsComponent', () => {
  let component: ViberMediaDetailsComponent;
  let fixture: ComponentFixture<ViberMediaDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViberMediaDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViberMediaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
