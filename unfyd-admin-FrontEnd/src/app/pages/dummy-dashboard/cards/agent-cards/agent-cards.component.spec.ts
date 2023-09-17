import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentCardsComponent } from './agent-cards.component';

describe('AgentCardsComponent', () => {
  let component: AgentCardsComponent;
  let fixture: ComponentFixture<AgentCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
