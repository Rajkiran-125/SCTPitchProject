import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelAttributeMappingComponent } from './channel-attribute-mapping.component';

describe('ChannelAttributeMappingComponent', () => {
  let component: ChannelAttributeMappingComponent;
  let fixture: ComponentFixture<ChannelAttributeMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelAttributeMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelAttributeMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
