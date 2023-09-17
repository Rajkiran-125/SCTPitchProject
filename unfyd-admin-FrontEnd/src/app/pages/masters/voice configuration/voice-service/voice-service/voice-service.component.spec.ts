import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceServiceComponent } from './voice-service.component';

describe('VoiceServiceComponent', () => {
  let component: VoiceServiceComponent;
  let fixture: ComponentFixture<VoiceServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoiceServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoiceServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
