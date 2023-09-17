import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CannedMessageComponent } from './canned-message.component';

describe('CannedMessageComponent', () => {
  let component: CannedMessageComponent;
  let fixture: ComponentFixture<CannedMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CannedMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CannedMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
