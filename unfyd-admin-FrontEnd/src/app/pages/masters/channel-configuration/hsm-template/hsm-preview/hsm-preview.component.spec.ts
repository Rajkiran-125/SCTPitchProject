import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HsmPreviewComponent } from './hsm-preview.component';

describe('HsmPreviewComponent', () => {
  let component: HsmPreviewComponent;
  let fixture: ComponentFixture<HsmPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HsmPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HsmPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
