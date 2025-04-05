import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewTicketPage } from './new-ticket.page';

describe('NewTicketPage', () => {
  let component: NewTicketPage;
  let fixture: ComponentFixture<NewTicketPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTicketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
