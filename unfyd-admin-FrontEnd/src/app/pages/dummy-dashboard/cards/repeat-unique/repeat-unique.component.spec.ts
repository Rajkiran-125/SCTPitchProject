import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatUniqueComponent } from './repeat-unique.component';

describe('RepeatUniqueComponent', () => {
  let component: RepeatUniqueComponent;
  let fixture: ComponentFixture<RepeatUniqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepeatUniqueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepeatUniqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
