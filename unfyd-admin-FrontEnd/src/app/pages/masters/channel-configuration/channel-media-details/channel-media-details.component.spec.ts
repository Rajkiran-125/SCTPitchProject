import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelMediaDetailsComponent } from './channel-media-details.component';

describe('ChannelMediaDetailsComponent', () => {
  let component: ChannelMediaDetailsComponent;
  let fixture: ComponentFixture<ChannelMediaDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelMediaDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelMediaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
