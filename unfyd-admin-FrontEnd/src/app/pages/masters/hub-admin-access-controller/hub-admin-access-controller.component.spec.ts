import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HubAdminAccessControllerComponent } from './hub-admin-access-controller.component';

describe('HubAdminAccessControllerComponent', () => {
  let component: HubAdminAccessControllerComponent;
  let fixture: ComponentFixture<HubAdminAccessControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HubAdminAccessControllerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HubAdminAccessControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
