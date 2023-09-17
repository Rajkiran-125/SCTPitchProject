import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentSettingsComponent } from './attachment-settings.component';

describe('AttachmentSettingsComponent', () => {
  let component: AttachmentSettingsComponent;
  let fixture: ComponentFixture<AttachmentSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachmentSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
