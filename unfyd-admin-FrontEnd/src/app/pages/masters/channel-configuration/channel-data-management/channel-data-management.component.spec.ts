import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelDataManagementComponent } from './channel-data-management.component';

describe('ChannelDataManagementComponent', () => {
  let component: ChannelDataManagementComponent;
  let fixture: ComponentFixture<ChannelDataManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelDataManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelDataManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
