import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskGroupViewComponent } from './task-group-view.component';

describe('TaskGroupViewComponent', () => {
  let component: TaskGroupViewComponent;
  let fixture: ComponentFixture<TaskGroupViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskGroupViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskGroupViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
