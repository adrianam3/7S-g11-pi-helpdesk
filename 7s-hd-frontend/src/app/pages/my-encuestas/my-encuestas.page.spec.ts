import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyEncuestasPage } from './my-encuestas.page';

describe('MyEncuestasPage', () => {
  let component: MyEncuestasPage;
  let fixture: ComponentFixture<MyEncuestasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyEncuestasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
