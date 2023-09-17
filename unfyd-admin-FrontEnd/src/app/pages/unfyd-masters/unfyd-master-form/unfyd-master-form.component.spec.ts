import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnfydMasterFormComponent } from './unfyd-master-form.component';

describe('UnfydMasterFormComponent', () => {
  let component: UnfydMasterFormComponent;
  let fixture: ComponentFixture<UnfydMasterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnfydMasterFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnfydMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
