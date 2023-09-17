import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockdemandgenerationComponent } from './stockdemandgeneration.component';

describe('StockdemandgenerationComponent', () => {
  let component: StockdemandgenerationComponent;
  let fixture: ComponentFixture<StockdemandgenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockdemandgenerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockdemandgenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
