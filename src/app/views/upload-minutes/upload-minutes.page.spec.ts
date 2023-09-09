import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadMinutesPage } from './upload-minutes.page';

describe('UploadMinutasPage', () => {
  let component: UploadMinutesPage;
  let fixture: ComponentFixture<UploadMinutesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UploadMinutesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
