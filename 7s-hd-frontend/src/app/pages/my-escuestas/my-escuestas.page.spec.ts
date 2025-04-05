import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyEscuestasPage } from './my-escuestas.page';

describe('MyEscuestasPage', () => {
  let component: MyEscuestasPage;
  let fixture: ComponentFixture<MyEscuestasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyEscuestasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
