import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelConfigurationEditComponent } from './channel-configuration-edit.component';

describe('ChannelConfigurationEditComponent', () => {
  let component: ChannelConfigurationEditComponent;
  let fixture: ComponentFixture<ChannelConfigurationEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelConfigurationEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelConfigurationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
