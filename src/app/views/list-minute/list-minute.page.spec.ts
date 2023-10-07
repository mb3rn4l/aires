import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListMinutePage } from './list-minute.page';

describe('ListMinutePage', () => {
  let component: ListMinutePage;
  let fixture: ComponentFixture<ListMinutePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListMinutePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
