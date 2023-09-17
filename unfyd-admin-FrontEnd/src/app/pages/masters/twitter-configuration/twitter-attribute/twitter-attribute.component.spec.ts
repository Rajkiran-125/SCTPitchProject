import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitterAttributeComponent } from './twitter-attribute.component';

describe('TwitterAttributeComponent', () => {
  let component: TwitterAttributeComponent;
  let fixture: ComponentFixture<TwitterAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwitterAttributeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitterAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
