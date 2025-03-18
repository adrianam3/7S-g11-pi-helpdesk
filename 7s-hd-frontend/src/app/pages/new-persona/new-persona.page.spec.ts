import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewPersonaPage } from './new-persona.page';

describe('NewPersonaPage', () => {
  let component: NewPersonaPage;
  let fixture: ComponentFixture<NewPersonaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPersonaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
