import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DownloadMinutasPage } from './download-minutes.page';

describe('DownloadMinutasPage', () => {
  let component: DownloadMinutasPage;
  let fixture: ComponentFixture<DownloadMinutasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DownloadMinutasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
