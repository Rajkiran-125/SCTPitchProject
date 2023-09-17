import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViberAuthTypeComponent } from './viber-auth-type.component';

describe('ViberAuthTypeComponent', () => {
  let component: ViberAuthTypeComponent;
  let fixture: ComponentFixture<ViberAuthTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViberAuthTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViberAuthTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
