import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportChatScriptComponent } from './report-chat-script.component';

describe('ReportGrievanceStatusComponent', () => {
  let component: ReportChatScriptComponent;
  let fixture: ComponentFixture<ReportChatScriptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportChatScriptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportChatScriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
