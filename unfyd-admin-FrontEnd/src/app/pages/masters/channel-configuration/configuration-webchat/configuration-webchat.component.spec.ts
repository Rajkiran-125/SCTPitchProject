import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationWebchatComponent } from './configuration-webchat.component';

describe('ConfigurationWebchatComponent', () => {
  let component: ConfigurationWebchatComponent;
  let fixture: ComponentFixture<ConfigurationWebchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationWebchatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationWebchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
