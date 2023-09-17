import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationAddChannelComponent } from './configuration-add-channel.component';

describe('ConfigurationAddChannelComponent', () => {
  let component: ConfigurationAddChannelComponent;
  let fixture: ComponentFixture<ConfigurationAddChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationAddChannelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationAddChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
