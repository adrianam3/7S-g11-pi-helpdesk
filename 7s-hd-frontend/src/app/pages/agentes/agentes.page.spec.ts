import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgentesPage } from './agentes.page';

describe('AgentesPage', () => {
  let component: AgentesPage;
  let fixture: ComponentFixture<AgentesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
