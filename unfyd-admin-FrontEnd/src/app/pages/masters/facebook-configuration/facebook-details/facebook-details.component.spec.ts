import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookDetailsComponent } from './facebook-details.component';

describe('FacebookDetailsComponent', () => {
  let component: FacebookDetailsComponent;
  let fixture: ComponentFixture<FacebookDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacebookDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebookDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
