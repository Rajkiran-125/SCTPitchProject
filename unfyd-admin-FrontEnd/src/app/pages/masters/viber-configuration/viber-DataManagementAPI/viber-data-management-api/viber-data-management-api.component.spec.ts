import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViberDataManagementAPIComponent } from './viber-data-management-api.component';

describe('ViberDataManagementAPIComponent', () => {
  let component: ViberDataManagementAPIComponent;
  let fixture: ComponentFixture<ViberDataManagementAPIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViberDataManagementAPIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViberDataManagementAPIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
