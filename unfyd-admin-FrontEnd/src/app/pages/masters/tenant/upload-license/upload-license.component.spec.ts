import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadLicenseComponent } from './upload-license.component';

describe('UploadLicenseComponent', () => {
  let component: UploadLicenseComponent;
  let fixture: ComponentFixture<UploadLicenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadLicenseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadLicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
