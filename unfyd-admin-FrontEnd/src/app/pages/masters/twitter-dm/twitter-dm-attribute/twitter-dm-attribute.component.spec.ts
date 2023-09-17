import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitterDmAttributeComponent } from './twitter-dm-attribute.component';

describe('TwitterDmAttributeComponent', () => {
  let component: TwitterDmAttributeComponent;
  let fixture: ComponentFixture<TwitterDmAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwitterDmAttributeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitterDmAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
