import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSubCategoryComponent } from './form-sub-category.component';

describe('FormSubCategoryComponent', () => {
  let component: FormSubCategoryComponent;
  let fixture: ComponentFixture<FormSubCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormSubCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
