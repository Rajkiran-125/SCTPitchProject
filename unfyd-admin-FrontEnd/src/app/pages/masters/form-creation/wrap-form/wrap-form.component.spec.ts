import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapFormComponent } from './wrap-form.component';

describe('WrapFormComponent', () => {
  let component: WrapFormComponent;
  let fixture: ComponentFixture<WrapFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrapFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
