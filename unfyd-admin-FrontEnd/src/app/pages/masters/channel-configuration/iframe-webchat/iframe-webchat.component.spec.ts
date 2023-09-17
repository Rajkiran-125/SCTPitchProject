import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IframeWebchatComponent } from './iframe-webchat.component';

describe('IframeWebchatComponent', () => {
  let component: IframeWebchatComponent;
  let fixture: ComponentFixture<IframeWebchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IframeWebchatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IframeWebchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
