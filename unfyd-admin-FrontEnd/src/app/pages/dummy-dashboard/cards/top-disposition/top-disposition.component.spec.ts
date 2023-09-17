import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopDispositionComponent } from './top-disposition.component';

describe('TopDispositionComponent', () => {
  let component: TopDispositionComponent;
  let fixture: ComponentFixture<TopDispositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopDispositionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopDispositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
