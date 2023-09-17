import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleSubtypeComponent } from './role-subtype.component';

describe('RoleSubtypeComponent', () => {
  let component: RoleSubtypeComponent;
  let fixture: ComponentFixture<RoleSubtypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleSubtypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleSubtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
