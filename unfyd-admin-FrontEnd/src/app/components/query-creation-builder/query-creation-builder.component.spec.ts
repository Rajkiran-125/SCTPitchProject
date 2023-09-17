import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryCreationBuilderComponent } from './query-creation-builder.component';

describe('QueryCreationBuilderComponent', () => {
  let component: QueryCreationBuilderComponent;
  let fixture: ComponentFixture<QueryCreationBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryCreationBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryCreationBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
