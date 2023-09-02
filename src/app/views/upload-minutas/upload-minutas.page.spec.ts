import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadMinutasPage } from './upload-minutas.page';

describe('UploadMinutasPage', () => {
  let component: UploadMinutasPage;
  let fixture: ComponentFixture<UploadMinutasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UploadMinutasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
