import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseConocimientoPage } from './base-conocimiento.page';

describe('BaseConocimientoPage', () => {
  let component: BaseConocimientoPage;
  let fixture: ComponentFixture<BaseConocimientoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseConocimientoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
