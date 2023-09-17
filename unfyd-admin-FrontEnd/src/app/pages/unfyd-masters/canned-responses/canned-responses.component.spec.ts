import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CannedResponsesComponent } from './canned-responses.component';

describe('CannedResponsesComponent', () => {
  let component: CannedResponsesComponent;
  let fixture: ComponentFixture<CannedResponsesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CannedResponsesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CannedResponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
