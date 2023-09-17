import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelepathyActionComponent } from './telepathy-action.component';

describe('TelepathyActionComponent', () => {
  let component: TelepathyActionComponent;
  let fixture: ComponentFixture<TelepathyActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelepathyActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TelepathyActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
