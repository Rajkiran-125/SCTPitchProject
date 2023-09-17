import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelApiProviderComponent } from './channel-api-provider.component';

describe('ChannelApiProviderComponent', () => {
  let component: ChannelApiProviderComponent;
  let fixture: ComponentFixture<ChannelApiProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelApiProviderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelApiProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
