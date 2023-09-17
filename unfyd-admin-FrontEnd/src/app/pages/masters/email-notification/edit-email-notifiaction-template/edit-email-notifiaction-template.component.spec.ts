import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmailNotifiactionTemplateComponent } from './edit-email-notifiaction-template.component';

describe('EditEmailNotifiactionTemplateComponent', () => {
  let component: EditEmailNotifiactionTemplateComponent;
  let fixture: ComponentFixture<EditEmailNotifiactionTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEmailNotifiactionTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmailNotifiactionTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
