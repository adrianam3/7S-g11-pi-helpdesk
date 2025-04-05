import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NTicketPage } from './n-ticket.page';

describe('NTicketPage', () => {
  let component: NTicketPage;
  let fixture: ComponentFixture<NTicketPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NTicketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
