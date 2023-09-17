import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelMappingComponent } from './channel-mapping.component';

describe('ChannelMappingComponent', () => {
  let component: ChannelMappingComponent;
  let fixture: ComponentFixture<ChannelMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
