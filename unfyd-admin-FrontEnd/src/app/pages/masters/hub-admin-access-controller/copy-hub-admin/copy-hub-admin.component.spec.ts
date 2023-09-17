import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyHubAdminComponent } from './copy-hub-admin.component';

describe('CopyHubAdminComponent', () => {
  let component: CopyHubAdminComponent;
  let fixture: ComponentFixture<CopyHubAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyHubAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyHubAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
